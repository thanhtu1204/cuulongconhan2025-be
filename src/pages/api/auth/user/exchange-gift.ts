import cookie from 'cookie';
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuth } from '@/libs/auth';
import DatabaseCis from '@/libs/dbCis';
import {
  connectAndExecute,
  getGiftByGiftCode,
  getInfoByUsername,
  updateGiftCode
} from '@/libs/NineDragonsAccount';
import type BaseResponse from '@/utils/BaseResponse';
import { isExpiredDate, rateLimiterMiddleware } from '@/utils/utils';

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
    const { code } = req.body;
    if (!code) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Dữ liệu không hợp lệ',
        data: null
      };
      return res.status(500).json(response);
    }
    let userInfo: any;
    let giftInfo: any;
    await connectAndExecute(async (pool) => {
      userInfo = await getInfoByUsername(pool, verifiedToken.user_name);
      giftInfo = await getGiftByGiftCode(pool, code);
    });

    if (_.isEmpty(userInfo) || _.isEmpty(giftInfo) || giftInfo?.delete_flag === true) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Gift Code không hợp lệ',
        data: null
      };
      return res.status(500).json(response);
    }

    if (isExpiredDate(giftInfo?.expried_date)) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Gift Code đã hết hạn sử dụng',
        data: null
      };
      return res.status(500).json(response);
    }

    if ((giftInfo && giftInfo?.active_user) || (giftInfo && giftInfo?.active_id)) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Gift Code đã được sử dụng',
        data: null
      };
      return res.status(500).json(response);
    }
    const user = userInfo[0];
    const itemAdd = {
      user_id: user.user_name,
      cart_itemCode: giftInfo.item_code,
      game_server: 0,
      item_price: 0
    };
    await DatabaseCis.exchangeGift(itemAdd);
    let updateStatus;
    const dataUpdate = {
      id: giftInfo?.item_id,
      active_user: user.user_name,
      active_id: user.user_id
    };

    await connectAndExecute(async (pool) => {
      updateStatus = await updateGiftCode(pool, dataUpdate);
    });

    const response: BaseResponse = {
      status: 200,
      success: true,
      message: 'Đổi gift code thành công',
      data: updateStatus
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
