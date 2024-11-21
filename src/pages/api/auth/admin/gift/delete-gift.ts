import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuthAdmin } from '@/libs/auth';
import { connectAndExecute, deleteGiftById } from '@/libs/NineDragonsAccount';
import type BaseResponse from '@/utils/BaseResponse';
import { rateLimiterMiddleware } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const clientIp = req.socket.remoteAddress;
  const isAllowed = rateLimiterMiddleware(clientIp ?? '') || false;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  const verifiedToken = token && (await verifyAuthAdmin(token).catch(() => {}));

  if (!isAllowed) {
    return res
      .status(429)
      .json({ status: 429, message: 'Yêu cầu quá nhanh, vui lòng thử lại sau.' });
  }

  if (!verifiedToken) {
    return res.status(401).json({
      status: 401,
      message: 'Phiên đăng nhập hết hạn hoặc không có quyền thao tác',
      data: null
    });
  }

  try {
    const numericRegex = /^[0-9]+$/;

    const { id } = req.body;
    if (!id || !numericRegex.test(id)) {
      const response: BaseResponse = {
        status: 400,
        success: false,
        message: 'Bad Request',
        data: null
      };
      return res.status(400).json(response);
    }

    let news;
    await connectAndExecute(async (pool) => {
      news = await deleteGiftById(pool, id);
    });

    if (news) {
      const response: BaseResponse = {
        status: 200,
        success: true,
        message: 'Delete Success',
        data: news
      };

      return res.status(200).json(response);
    }
    const response: BaseResponse = {
      status: 500,
      success: true,
      message: 'Không tìm thấy id hoặc update lỗi!',
      data: news
    };

    return res.status(500).json(response);
  } catch (error) {
    const response: BaseResponse = {
      status: 500,
      success: false,
      message: 'An internal server error occurred'
    };
    return res.status(500).json(response);
  }
}
