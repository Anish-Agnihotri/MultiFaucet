import Redis from "ioredis"; // Redis
import { Network } from './types/dto/create-network.dto';

export const client = new Redis(process.env.REDIS_URL);

export const networkOps = {
  async readNetworks(): Promise<Network[]> {
    const keys = await client.keys('network_id*')
    const values = await Promise.all(keys.map(key => client.hgetall(key)))

    return values as unknown[] as Network[];
  },
  async clearNetworks(): Promise<void> {
    const keys = await client.keys('network_id*')

    await Promise.all(keys.map(key => client.del(key)));
  },

  async insertNetworks(networks: Network[]): Promise<void> {
    await Promise.all(networks.map(network => client.hmset(`network_id${network.chainId}`, network as Record<string, any>)))
  }
}