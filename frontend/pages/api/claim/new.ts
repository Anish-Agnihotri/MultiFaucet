import Redis from "ioredis"; // Redis
import { ethers } from "ethers"; // Ethers
import { isValidInput } from "pages/index"; // Address check
import { getSession } from "next-auth/client"; // Session management
import { hasClaimed } from "pages/api/claim/status"; // Claim status
import type { NextApiRequest, NextApiResponse } from "next"; // Types

// Setup redis client
const client = new Redis(process.env.REDIS_URL);

// Setup networks
const ARBITRUM: number = 421611;
const AVALANCHE_FUJI: number = 43113;
const rpcNetworks: Record<number, string> = {
  3: "eth-ropsten.alchemyapi.io",
  4: "eth-rinkeby.alchemyapi.io",
  5: "eth-goerli.alchemyapi.io",
  42: "eth-kovan.alchemyapi.io",
  69: "opt-kovan.g.alchemy.com",
  80001: "polygon-mumbai.g.alchemy.com",
  421611: "arb-rinkeby.g.alchemy.com",
  43113: "https://api.avax-test.network/ext/bc/C/rpc",
};

// Setup faucet interface
const iface = new ethers.utils.Interface([
  "function drip(address _recipient) external",
]);

/**
 * Generates tx input data for drip claim
 * @param {string} recipient address
 * @returns {string} encoded input data
 */
function generateTxData(recipient: string): string {
  // Encode address for drip function
  return iface.encodeFunctionData("drip", [recipient]);
}

/**
 * Collects StaticJsonRpcProvider by network
 * @param {number} network id
 * @returns {ethers.providers.StaticJsonRpcProvider} provider
 */
function getProviderByNetwork(
  network: number
): ethers.providers.StaticJsonRpcProvider {
  // Collect alchemy RPC URL
  const rpcUrl = rpcNetworks[network];

  // Return setup static provider
  return new ethers.providers.StaticJsonRpcProvider(
    // If network is Avalanche
    network === AVALANCHE_FUJI
      ? // Return custom RPC
        rpcUrl
      : // Else, setup Alchemy RPC
        `https://${rpcUrl}/v2/${process.env.ALCHEMY_API_KEY}`
  );
}

/**
 * Collects nonce by network (cache first)
 * @param {number} network id
 * @returns {Promise<number>} network account nonce
 */
async function getNonceByNetwork(network: number): Promise<number> {
  // Collect nonce from redis
  const redisNonce: string | null = await client.get(`nonce-${network}`);

  // If no redis nonce
  if (redisNonce == null) {
    // Update to last network nonce
    const provider = getProviderByNetwork(network);
    return await provider.getTransactionCount(
      // Collect nonce for operator
      process.env.NEXT_PUBLIC_OPERATOR_ADDRESS ?? ""
    );
  } else {
    // Else, return cached nonce
    return Number(redisNonce);
  }
}

/**
 * Returns populated drip transaction for a network
 * @param {ethers.Wallet} wallet without RPC network connected
 * @param {number} network id
 * @param {string} data input for tx
 */
async function processDrip(
  wallet: ethers.Wallet,
  network: number,
  data: string
): Promise<void> {
  // Collect provider
  const provider = getProviderByNetwork(network);

  // Connect wallet to network
  const rpcWallet = wallet.connect(provider);
  // Collect nonce for network
  const nonce = await getNonceByNetwork(network);
  // Collect gas price * 2 for network
  const gasPrice = (await provider.getGasPrice()).mul(2);

  // Update nonce for network in redis w/ 5m ttl
  await client.set(`nonce-${network}`, nonce + 1, "EX", 300);

  // Return populated transaction
  try {
    await rpcWallet.sendTransaction({
      to: process.env.FAUCET_ADDRESS ?? "",
      from: wallet.address,
      gasPrice,
      // Custom gas override for Arbitrum w/ min gas limit
      gasLimit: network === ARBITRUM ? 5_000_000 : 500_000,
      data,
      nonce,
    });
  } catch (e) {
    console.log(e);
    throw new Error(`Error when processing drip for network ${network}`);
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Collect session (force any for extra twitter params)
  const session: any = await getSession({ req });
  // Collect address
  const { address } = req.body;

  if (!session) {
    // Return unauthed status
    return res.status(401).send({ error: "Not authenticated." });
  }

  if (!address || !isValidInput(address)) {
    // Return invalid address status
    return res.status(400).send({ error: "Invalid address." });
  }

  // Collect address
  let addr: string = address;
  // If address is ENS name
  if (~address.toLowerCase().indexOf(".eth")) {
    // Setup custom mainnet provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`
    );

    // Collect 0x address from ENS
    const resolvedAddress = await provider.resolveName(address);

    // If no resolver set
    if (!resolvedAddress) {
      // Return invalid ENS status
      return res
        .status(400)
        .send({ error: "Invalid ENS name. No reverse record." });
    }

    // Else, set address
    addr = resolvedAddress;
  }

  const claimed: boolean = await hasClaimed(session.twitter_id);
  if (claimed) {
    // Return already claimed status
    return res.status(400).send({ error: "Already claimed in 24h window" });
  }

  // Setup wallet w/o RPC provider
  const wallet = new ethers.Wallet(process.env.OPERATOR_PRIVATE_KEY ?? "");

  // Generate transaction data
  const data: string = generateTxData(addr);

  // For each network
  for (const networkId of Object.keys(rpcNetworks)) {
    try {
      // Process faucet claims
      await processDrip(wallet, Number(networkId), data);
    } catch (e) {
      console.log(e);
      // If error in process, revert
      return res
        .status(500)
        .send({ error: "Error claiming, try again in 5 minutes." });
    }
  }

  // Update 24h claim status
  await client.set(session.twitter_id, "true", "EX", 86400);
  return res.status(200).send({ claimed: address });
};
