import cookie from 'cookie';
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuth } from '@/libs/auth';
import DatabaseCis from '@/libs/dbCis';
import {
  connectAndExecute,
  createHistoryItemEventRewards,
  getEventRewardByType,
  getHistoryEventRewardById,
  getOnlyEventRewardByType
} from '@/libs/NineDragonsAccount';
import type BaseResponse from '@/utils/BaseResponse';
import { rateLimiterMiddleware } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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
    const { id } = req.body;
    if (!id) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Dữ liệu không hợp lệ',
        data: null
      };
      return res.status(500).json(response);
    }
    let history: any;
    let dataReward: any;
    let eventReward: any;
    await connectAndExecute(async (pool) => {
      history = await getHistoryEventRewardById(pool, verifiedToken.user_name);
      dataReward = await getEventRewardByType(pool, 1, verifiedToken.user_name);
      eventReward = await getOnlyEventRewardByType(pool, 1);

      // userInfo = await getInfoByUsername(pool, verifiedToken.user_name);
      // giftInfo = await getGiftByGiftCode(pool, id);
    });

    const hasCompleted = _.some(history, { reward_id: id });
    if (hasCompleted) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Dữ liệu không hợp lệ',
        data: null
      };
      return res.status(500).json(response);
    }

    const itemReward: any = _.find(dataReward, { reward_id: Number(id) });

    const balanceUser = await DatabaseCis.countBalanceUsedByUserName(
      verifiedToken.user_name,
      eventReward.start_time,
      eventReward.end_time
    );
    const isAvailable =
      Number(balanceUser?.total_spent ?? 0) >= Number(itemReward?.required_points);

    if (!_.isEmpty(itemReward) && itemReward?.status === 'unused' && isAvailable) {
      let addHistorySuccess;
      await connectAndExecute(async (pool) => {
        const items = {
          reward_id: itemReward?.reward_id,
          event_id: itemReward?.event_id,
          reward_item_code: itemReward?.reward_item_code,
          user_id: verifiedToken?.id,
          user_name: verifiedToken?.user_name
        };
        addHistorySuccess = await createHistoryItemEventRewards(pool, items);
      });

      if (addHistorySuccess) {
        const itemAdd = {
          user_id: verifiedToken.user_name,
          cart_itemCode: itemReward.reward_item_code,
          game_server: 0,
          item_price: 0
        };
        await DatabaseCis.exchangeGift(itemAdd);

        const response: BaseResponse = {
          status: 200,
          success: false,
          message: 'Nhận quà thành công',
          data: null
        };
        return res.status(200).json(response);
      }
    }

    const response: BaseResponse = {
      status: 500,
      success: false,
      message: 'Có lỗi xảy ra vui lòng thử lại sau',
      data: null
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
