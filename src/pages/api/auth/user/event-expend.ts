import cookie from 'cookie';
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuth } from '@/libs/auth';
import DatabaseCis from '@/libs/dbCis';
import {
  connectAndExecute,
  getEventRewardByType,
  getOnlyEventRewardByType
} from '@/libs/NineDragonsAccount';
import type BaseResponse from '@/utils/BaseResponse';
import { rateLimiterMiddlewareByCount } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ statu: 405, error: 'Method Not Allowed' });
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
    let dataReward: any;
    let eventReward: any;
    // let history: any;
    // let history: any;

    await connectAndExecute(async (pool) => {
      dataReward = await getEventRewardByType(pool, 1, user);
      eventReward = await getOnlyEventRewardByType(pool, 1);
      // history = await getHistoryEventRewardById(pool, user);
    });

    if (!eventReward) {
      const response: BaseResponse = {
        status: 200,
        success: true,
        message: 'Get data success',
        data: { dataReward: [], eventReward: {}, balanceUser: {} }
      };
      return res.status(200).json(response);
    }

    const balanceUser: any = await DatabaseCis.countBalanceUsedByUserName(
      user,
      eventReward.start_time,
      eventReward.end_time
    );

    const isAvailable = balanceUser && Number(balanceUser?.total_spent ?? 0) > 0;
    if (isAvailable && !_.isEmpty(dataReward)) {
      dataReward.forEach((record: any) => {
        const isActive =
          Number(balanceUser?.total_spent ?? 0) >= Number(record?.required_points) &&
          record.status === 'unused';
        if (isActive) {
          record.status = 'active';
        }
      });
      const response: BaseResponse = {
        status: 200,
        success: true,
        message: 'Get data success',
        data: { dataReward, eventReward, balanceUser }
      };
      return res.status(200).json(response);
    }

    const response: BaseResponse = {
      status: 200,
      success: true,
      message: 'Get data success',
      data: { dataReward, eventReward, balanceUser }
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: BaseResponse = {
      status: 500,
      success: false,
      message: 'Không có dữ liệu vui lòng thử lại sau!'
    };
    return res.status(500).json(response);
  }
}
