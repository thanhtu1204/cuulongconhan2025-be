import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuth } from '@/libs/auth';
import NineDragonsAccount from '@/libs/dbNineDragonsAccount';
import type BaseResponse from '@/utils/BaseResponse';
import { rateLimiterMiddlewareByCount } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ statu: 405, error: 'Method Not Allowed' });
  }

  const clientIp = req.socket.remoteAddress;
  const isAllowed = rateLimiterMiddlewareByCount(clientIp ?? '', 25) || false;
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(' ')[1];
  const verifiedToken = token && (await verifyAuth(token).catch(() => {}));

  if (!isAllowed) {
    return res
      .status(429)
      .json({ status: 429, message: 'Yêu cầu quá nhanh, vui lòng thử lại sau.' });
  }
  if (!verifiedToken) {
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', '', {
        maxAge: -1,
        path: '/'
      })
    );
    return res
      .status(401)
      .json({ status: 401, message: 'Phiên đăng nhập hết hạn vui lòng thử lại sau!', data: null });
  }

  const { oldPassword, password } = req.body;

  // Kiểm tra password
  if (password.length < 6 || password.length > 50) {
    const response = {
      status: 500,
      success: true,
      message: 'Mật khẩu phải có từ 6 đến 50 ký tự.',
      data: null
    };
    return res.status(500).json(response);
  }

  if (oldPassword.length < 6 || oldPassword.length > 50) {
    const response = {
      status: 500,
      success: true,
      message: 'Mật khẩu cũ phải có từ 6 đến 50 ký tự.',
      data: null
    };
    return res.status(500).json(response);
  }

  try {
    const username = verifiedToken.user_name;
    const payload = {
      password,
      oldPassword,
      username
    };
    const user = await NineDragonsAccount.userChangePassword(payload);
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'Có lỗi xảy ra vui lòng thử lại sau!'
      });
    }

    const response: BaseResponse = {
      status: 200,
      success: true,
      message: 'Đổi mật khẩu thành công',
      data: {
        success: true
      }
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
