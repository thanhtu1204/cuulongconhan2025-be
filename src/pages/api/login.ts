import type { NextApiRequest, NextApiResponse } from 'next';

import NineDragonsAccount from '@/libs/dbNineDragonsAccount';
import type BaseResponse from '@/utils/BaseResponse';
import { rateLimiterMiddleware } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 405, error: 'Method Not Allowed' });
  }
  const clientIp = req.socket.remoteAddress;
  const isAllowed = rateLimiterMiddleware(clientIp ?? '') || false;
  if (!isAllowed) {
    return res
      .status(429)
      .json({ status: 429, message: 'Yêu cầu quá nhanh, vui lòng thử lại sau.' });
  }

  const { username, password } = req.body;
  if (username.length < 6 || username.length > 50) {
    const response: BaseResponse = {
      status: 500,
      success: true,
      message: 'Tên người dùng phải có từ 4 đến 50 ký tự.',
      data: null
    };
    return res.status(500).json(response);
  }
  if (password.length < 6 || password.length > 50) {
    const response: BaseResponse = {
      success: true,
      status: 500,
      message: 'Mật khẩu phải có từ 4 đến 50 ký tự.',
      data: null
    };
    return res.status(500).json(response);
  }

  try {
    const login = await NineDragonsAccount.login(username, password);
    if (!login) {
      return res.status(404).json({
        status: 404,
        error: 'No data found'
      });
    }

    const response: BaseResponse = {
      status: 200,
      success: true,
      message: 'Get data success',
      data: login
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorString = (error as Error).message; // Type assertion to tell TypeScript it's an Error

    const response: BaseResponse = {
      status: 500,
      success: false,
      message: errorString,
      data: null
    };
    return res.status(500).json(response);
  }
}
