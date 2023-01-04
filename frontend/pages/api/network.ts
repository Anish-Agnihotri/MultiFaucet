import { CreateNetworkDto } from './../../core/types/dto/create-network.dto';
import { plainToClass } from 'class-transformer';
import { networkOps } from './../../core/redis';
import { NextApiRequest, NextApiResponse } from 'next'
import { validate } from 'class-validator';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT' || req.method === 'POST') {
    try {
      const body = plainToClass(CreateNetworkDto, req.body)
      const errors = await validate(body);

      if (errors.length) {
        return res.status(400).json({ error: errors })
      }

      if (body.key !== process.env.ADMIN_KEY) {
        return res.status(403).json({ error: 'Unauthorized' })
      }

      if (req.method === 'PUT') {
        await networkOps.clearNetworks();
      }
      await networkOps.insertNetworks(body.networks);

      return res.status(200).json({ result: 'success' })
    } catch (e: any) {
      return res.status(500).json({ error: e.message })
    }
  }

  if (req.method === 'GET') {
    try {
      res.status(200).json({ networks: await networkOps.readNetworks() })
    } catch (e: any) {
      return res.status(500).json({ error: e.message })
    }
  }
}
