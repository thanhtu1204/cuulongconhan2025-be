import type { NextApiRequest, NextApiResponse } from 'next';

import Database from '@/libs/dbNDGAME';
import type BaseResponse from '@/utils/BaseResponse';
import { rateLimiterMiddleware } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const clientIp = req.socket.remoteAddress;
  const isAllowed = rateLimiterMiddleware(clientIp ?? '') || false;
  if (!isAllowed) {
    return res
      .status(429)
      .json({ status: 429, message: 'Request too fast, please try again later.' });
  }

  try {
    const data = await Database.getRankInfo();
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    const sortedByInnerLevel = data
      .slice()
      .sort((a: any, b: any) => b.inner_level - a.inner_level)
      .slice(0, 100);
    const sortedByMoney = data
      .slice()
      .sort((a: any, b: any) => parseInt(b.money, 10) - parseInt(a.money, 10))
      .slice(0, 100);
    const sortedByHonor = data
      .slice()
      .sort((a: any, b: any) => b.honor - a.honor)
      .slice(0, 100);
    const sortedByGong = data
      .slice()
      .sort((a: any, b: any) => parseInt(b.gong, 10) - parseInt(a.gong, 10))
      .slice(0, 100);

    const response: BaseResponse = {
      status: 200,
      success: true,
      message: 'Get data success',
      data: {
        sortedByInnerLevel,
        sortedByMoney,
        sortedByHonor,
        sortedByGong
      }
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: BaseResponse = {
      status: 500,
      success: false,
      message: 'An internal server error occurred'
    };
    return res.status(500).json(response);
  }
}
