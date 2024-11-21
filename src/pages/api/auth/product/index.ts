import type { NextApiRequest, NextApiResponse } from 'next';

import DatabaseCis from '@/libs/dbCis';
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
    const products = await DatabaseCis.getProduct();
    // await connectAndExecute(async (pool) => {
    //   products = await getProduct(pool);
    // });
    const response: BaseResponse = {
      status: 200,
      success: true,
      message: 'Get data success',
      data: products || []
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
