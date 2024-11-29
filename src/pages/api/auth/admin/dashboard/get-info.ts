import { isEmpty } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuthAdmin } from '@/libs/auth';
import { getAllBalanceHistories } from '@/libs/mongo/controller/BanlanceHistoryController';
import {
  connectAndExecute,
  countAllMoney,
  countAllUser,
  getAllTransV1
} from '@/libs/NineDragonsAccount';
import type BaseResponse from '@/utils/BaseResponse';
import { rateLimiterMiddleware } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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
    let item;
    const dataBonus = await getAllBalanceHistories();

    await connectAndExecute(async (pool) => {
      const { user_count } = await countAllUser(pool);
      const trans: any = await countAllMoney(pool);
      const allTrans = await getAllTransV1(pool);
      let totalMoney = 0;
      if (!isEmpty(trans)) {
        trans.forEach((i: any) => {
          totalMoney +=
            Number(i?.total_amount || 0) / (1 + Number(i?.discount_percentage || 0) / 100);
        });
      }
      item = {
        user_count,
        trans: { amount_total: totalMoney.toFixed(0) ?? 0 },
        allTrans,
        dataBonus
      };
    });
    if (item) {
      const response: BaseResponse = {
        status: 200,
        success: true,
        message: 'Get data success',
        data: item
      };

      return res.status(200).json(response);
    }
    const response: BaseResponse = {
      status: 500,
      success: true,
      message: 'Lỗi lấy dữ liệu!',
      data: item
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
