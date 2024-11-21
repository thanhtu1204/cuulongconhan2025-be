import cookie from 'cookie';
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuth } from '@/libs/auth';
import { generateQrByID } from '@/libs/qrCode';
import type BaseResponse from '@/utils/BaseResponse';
import { rateLimiterMiddleware } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ statu: 405, error: 'Method Not Allowed' });
  }

  const clientIp = req.socket.remoteAddress;
  const isAllowed = rateLimiterMiddleware(clientIp ?? '') || false;
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
    const { id } = verifiedToken;
    if (!id) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Dữ liệu không hợp lệ',
        data: null
      };
      return res.status(500).json(response);
    }

    const data = await generateQrByID(String(id));
    if (_.isEmpty(data)) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Dữ liệu không hợp lệ',
        data: null
      };
      return res.status(500).json(response);
    }

    const response: BaseResponse = {
      status: 200,
      success: true,
      message: 'Tạo QR thành công',
      data
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
