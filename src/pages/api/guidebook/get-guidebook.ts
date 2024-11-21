import type { NextApiRequest, NextApiResponse } from 'next';

import { getGuidBookById } from '@/libs/mongooDb';
import type BaseResponse from '@/utils/BaseResponse';
import { rateLimiterMiddlewareByCount } from '@/utils/utils';

export const config = {
  api: {
    responseLimit: false
  }
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const clientIp = req.socket.remoteAddress;
  const isAllowed = rateLimiterMiddlewareByCount(clientIp ?? '', 25) || false;
  if (!isAllowed) {
    return res
      .status(429)
      .json({ status: 429, message: 'Yêu cầu quá nhanh, vui lòng thử lại sau.' });
  }

  try {
    const { id } = req.body;
    if (!id) {
      const response: BaseResponse = {
        status: 400,
        success: false,
        message: 'Bad Request',
        data: null
      };
      return res.status(400).json(response);
    }
    const dataGuidebook = await getGuidBookById(id as string);
    const response: BaseResponse = {
      status: 200,
      success: true,
      message: 'Get data success',
      data: dataGuidebook
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
