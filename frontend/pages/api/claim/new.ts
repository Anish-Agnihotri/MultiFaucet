import { Network } from './../../../core/types/dto/create-network.dto';
import { ethers } from "ethers";
import { WebClient } from "@slack/web-api";
import { isValidInput } from "pages/index";
import parseTwitterDate from "utils/dates";
import { getSession } from "next-auth/client";
import { hasClaimed } from "pages/api/claim/status";
import type { NextApiRequest, NextApiResponse } from "next";
import { client, networkOps } from 'core/redis';

// Setup whitelist (Anish)
const whitelist: string[] = [];

// Setup slack client
const slack = new WebClient(process.env.SLACK_ACCESS_TOKEN);
const slackChannel: string = process.env.SLACK_CHANNEL ?? "";
/**
 * Post message to slack channel
 * @param {string} message to post
 */
async function postSlackMessage(message: string): Promise<void> {
  await slack.chat.postMessage({
    channel: slackChannel,
    text: message,
    // Ping user on error
    link_names: true,
  });
}

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
 * Collects nonce by network (cache first)
 * @param {Network} network Network
 * @returns {Promise<number>} network account nonce
 */
async function getNonceByNetwork(network: Network): Promise<number> {
  // Collect nonce from redis
  const redisNonce: string | null = await client.get(`nonce-${network.chainId}`);

  // If no redis nonce
  if (redisNonce == null) {
    // Update to last network nonce
    const provider = new ethers.providers.StaticJsonRpcProvider(network.rpc)
    return await provider.getTransactionCount(
      // Collect nonce for operator
      process.env.OPERATOR_ADDRESS ?? ""
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
  network: Network,
  data: string
): Promise<void> {
  const provider = new ethers.providers.StaticJsonRpcProvider(network.rpc)
  const rpcWallet = wallet.connect(provider);
  const nonce = await getNonceByNetwork(network);
  const gasPrice = (await provider.getGasPrice()).mul(2);

  // Update nonce for network in redis w/ 5m ttl
  await client.set(`nonce-${network}`, nonce + 1, "EX", 300);

  try {
    const rs = await rpcWallet.sendTransaction({
      to: network.faucetContractAddress,
      from: wallet.address,
      gasPrice,
      // Custom gas override for Arbitrum w/ min gas limit
      gasLimit: 500_000,
      data,
      nonce,
      type: 0,
    });
  } catch (e) {
    await postSlackMessage(
      `Multi Faucet Error dripping for ${provider.network.chainId}, ${String(
        (e as any).reason
      )}`
    );

    // Delete nonce key to attempt at self-heal
    const delStatus: number = await client.del(
      `nonce-${provider.network.chainId}`
    );
    await postSlackMessage(`Attempting self heal: ${delStatus}`);

    // Throw error
    throw new Error(`Error when processing drip for network ${network}`);
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session: any = await getSession({ req });
  const { address }: { address: string; } = req.body;

  if (!session) {
    return res.status(401).send({ error: "Not authenticated." });
  }

  const ONE_MONTH_SECONDS = 2629746;
  if (
    session.twitter_num_tweets == 0 ||
    session.twitter_num_followers < 15 ||
    // Less than 1 month old
    new Date().getTime() -
      parseTwitterDate(session.twitter_created_at).getTime() <
      ONE_MONTH_SECONDS
  ) {
    return res
      .status(400)
      .send({ error: "Twitter account does not pass anti-bot checks." });
  }

  if (!address || !isValidInput(address)) {
    return res.status(400).send({ error: "Invalid address." });
  }

  // Collect address from ENS
  let addr: string = address;
  // If address is ENS name
  if (~address.toLowerCase().indexOf(".eth")) {
    // Setup custom mainnet provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      'https://rpc.ankr.com/eth'
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
    return res.status(400).send({ error: "Already claimed in 24h window" });
  }

  const wallet = new ethers.Wallet(process.env.OPERATOR_PRIVATE_KEY ?? "");
  const data: string = generateTxData(addr);
  const networks = await networkOps.readNetworks()

  for (const network of networks) {
    try {
      await processDrip(wallet, network, data);
    } catch (e) {
      // If not whitelisted, force user to wait 15 minutes
      if (!whitelist.includes(session.twitter_id)) {
        // Update 24h claim status
        await client.set(session.twitter_id, "true", "EX", 900);
      }

      // If error in process, revert
      return res
        .status(500)
        .send({ error: "Error fully claiming, try again in 15 minutes." });
    }
  }

  if (!whitelist.includes(session.twitter_id)) {
    // Update 24h claim status
    await client.set(session.twitter_id, "true", "EX", 86400);
  }

  return res.status(200).send({ claimed: address });
};
