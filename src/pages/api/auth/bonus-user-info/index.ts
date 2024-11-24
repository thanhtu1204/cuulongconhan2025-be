import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuth } from '@/libs/auth';
import { findBonusUserByUserName } from '@/libs/mongo/controller/BonusUserController';
import type BaseResponse from '@/utils/BaseResponse';
import { rateLimiterMiddlewareByCount } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 405, error: 'Method Not Allowed' });
  }

  const clientIp = req.socket.remoteAddress;
  const isAllowed = rateLimiterMiddlewareByCount(clientIp ?? '', 50) || false;
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

  try {
    const user = verifiedToken.user_name;
    if (!user) {
      const response: BaseResponse = {
        status: 400,
        success: false,
        message: 'Bad Request',
        data: null
      };
      return res.status(400).json(response);
    }
    const userInfo = await findBonusUserByUserName(user);
    const response: BaseResponse = {
      status: 200,
      success: true,
      message: 'Get data success',
      data: userInfo ?? {}
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
