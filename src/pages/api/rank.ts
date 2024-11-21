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
      .json({ status: 429, message: 'Yêu cầu quá nhanh, vui lòng thử lại sau.' });
  }

  try {
    const rankInfo = await Database.getRankInfo();
    if (rankInfo.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    const response: BaseResponse = {
      status: 200,
      success: true,
      message: 'Get data success',
      data: rankInfo
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
