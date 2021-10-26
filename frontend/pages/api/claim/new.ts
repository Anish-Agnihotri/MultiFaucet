import Redis from "ioredis"; // Redis
import { ethers } from "ethers"; // Ethers
import { getSession } from "next-auth/client"; // Session management
import { hasClaimed } from "pages/api/claim/status"; // Claim status
import type { NextApiRequest, NextApiResponse } from "next"; // Types

// Setup redis client
const client = new Redis(process.env.REDIS_URL);

// Setup networks
const rpcNetworks: Record<number, string> = {
  /*1: "eth-mainnet.alchemyapi.io",
  3: "eth-ropsten.alchemyapi.io",*/
  4: "eth-rinkeby.alchemyapi.io",
  /*5: "eth-goerli.alchemyapi.io",
  42: "eth-kovan.alchemyapi.io",
  69: "opt-kovan.g.alchemy.com",
  80001: "polygon-mumbai.g.alchemy.com",
  421611: "arb-rinkeby.g.alchemy.com",*/
};

async function processDrips(recipient: string): Promise<void> {
  // Loop through networks
  for (const [networkId, rpcUrl] of Object.entries(rpcNetworks)) {
    // Setup rpc provider for network
    const rpcProvider = new ethers.providers.JsonRpcProvider(
      `https://${rpcUrl}/v2/${process.env.ALCHEMY_API_KEY}`
    );

    // Setup wallet with network rpc provider
    const operatorWallet = new ethers.Wallet(
      process.env.OPERATOR_PRIVATE_KEY ?? "",
      rpcProvider
    );

    // Setup faucet contract
    const faucetContract = new ethers.Contract(
      process.env.FAUCET_ADDRESS ?? "",
      ["function drip(address _recipient) external"],
      operatorWallet
    );

    // Get gas price of network * 2
    const gasPrice = (await rpcProvider.getGasPrice()).mul(2);

    // Send drip transaction
    try {
      await faucetContract.drip(recipient, { gasPrice, gasLimit: 250_000 });
    } catch {
      throw new Error(`Error when processing drip for network: ${networkId}`);
    }
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

  if (!address || !ethers.utils.getAddress(address)) {
    // Return invalid address status
    return res.status(400).send({ error: "Invalid address." });
  }

  const claimed: boolean = await hasClaimed(session.twitter_id);
  if (claimed) {
    // Return already claimed status
    return res.status(400).send({ error: "Already claimed in 24h window" });
  }

  try {
    // Process new faucet claim
    await processDrips(address);
  } catch (e) {
    // If error in process, revert
    return res.status(500).send({ error: "Error claiming or faucet empty" });
  }

  // Update 24h claim status
  await client.set(session.twitter_id, "true", "EX", "86400");
  return res.status(200).send({ claimed: address });
};
