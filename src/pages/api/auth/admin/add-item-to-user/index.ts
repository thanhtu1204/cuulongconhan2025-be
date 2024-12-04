import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuthAdmin } from '@/libs/auth';
import DatabaseCis from '@/libs/dbCis';
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

  const { userName, code } = req.body;
  if (!userName || !code) {
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
      const userData = resUser[0];
      const itemAdd = {
        user_id: userData.user_name,
        cart_itemCode: code,
        game_server: 0,
        item_price: 0
      };

      const itemTrans = {
        itemCode: String(code),
        active_id: userData.user_id,
        active_user: userData.user_name
      };

      const addNewTrasnsaction = await DatabaseDragonsAccount.addGiftByAdmin(itemTrans);
      if (addNewTrasnsaction?.data && addNewTrasnsaction?.status === 200) {
        await DatabaseCis.adminAddGift(itemAdd);
        const response: BaseResponse = {
          status: 200,
          success: true,
          message: `Gửi quà thành công cho ${userName} code : ${code}`,
          data: {
            status: 200
          }
        };
        return res.status(200).json(response);
      }
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
