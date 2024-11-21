import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuthAdmin } from '@/libs/auth';
import DatabaseDragonsAccount from '@/libs/dbNineDragonsAccount';
import type BaseResponse from '@/utils/BaseResponse';
import { rateLimiterMiddleware } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 405, error: 'Method Not Allowed' });
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

  const { userName, balance } = req.body;
  if (!userName || !balance) {
    const response: BaseResponse = {
      status: 500,
      success: true,
      message: 'Dữ liệu không hợp lệ',
      data: null
    };
    return res.status(500).json(response);
  }
  try {
    const resUser = await DatabaseDragonsAccount.getUserByUsername(userName);

    if (!_.isEmpty(resUser)) {
      const statusAdd = await DatabaseDragonsAccount.addBalance(userName, balance);
      if (!_.isEmpty(res)) {
        const response: BaseResponse = {
          status: 200,
          success: true,
          message: `Nạp tiền thành công cho ${userName} số tền : ${balance}`,
          data: {
            statusAdd
          }
        };
        return res.status(200).json(response);
      }

      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Lỗi không xác định',
        data: null
      };
      return res.status(500).json(response);
    }

    const response: BaseResponse = {
      status: 500,
      success: false,
      message: 'User không tồn tại',
      data: null
    };
    return res.status(500).json(response);
  } catch (e) {
    const response: BaseResponse = {
      status: 500,
      success: true,
      message: e?.message,
      data: {
        success: false
      }
    };
    return res.status(500).json(response);
  }
}
