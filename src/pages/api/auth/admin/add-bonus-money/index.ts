import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuthAdmin } from '@/libs/auth';
import { sendTelegramNotification } from '@/libs/customNoti';
import DatabaseDragonsAccount from '@/libs/dbNineDragonsAccount';
import { syncAndUpdateBalance } from '@/libs/mongo/controller/BonusUserController';
import type BaseResponse from '@/utils/BaseResponse';
import { numberWithDot, rateLimiterMiddleware } from '@/utils/utils';

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

  const isValidBalance = (value: any) => {
    const regex = /^\d+(\.\d+)?$/;
    return regex.test(value);
  };

  const { userName, balance, description } = req.body;
  if (!userName || !balance || !isValidBalance(balance) || !description) {
    const response: BaseResponse = {
      status: 500,
      success: true,
      message: 'Dữ liệu không hợp lệ',
      data: null
    };
    return res.status(500).json(response);
  }
  try {
    const resUser: any = await DatabaseDragonsAccount.getUserByUsername(userName);
    if (!_.isEmpty(resUser)) {
      const firstUser = _.get(resUser, '[0]', null);

      if (firstUser) {
        const statusAdd = await syncAndUpdateBalance(firstUser, Number(balance));
        if (!_.isEmpty(res)) {
          const message = `
🚫Nạp tiền vào tkkm 🚫
Nạp tiền thành công cho tài khoản: ${userName}
Số tiền: ${numberWithDot(Number(balance) ?? 0)} VND
Nội dung: ${description}
`;
          await sendTelegramNotification(message);
          const response: BaseResponse = {
            status: 200,
            success: true,
            message: `Nạp tiền khuyến mãi thành công cho ${userName} số tền : ${balance}`,
            data: {
              statusAdd
            }
          };
          return res.status(200).json(response);
        }
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
