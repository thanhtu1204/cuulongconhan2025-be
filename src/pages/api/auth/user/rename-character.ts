import cookie from 'cookie';
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuth } from '@/libs/auth';
import dbNDGAME from '@/libs/dbNDGAME';
import NineDragonsAccount from '@/libs/dbNineDragonsAccount';
import { connectAndExecute, getUserInfoByUsername } from '@/libs/NineDragonsAccount';
import type BaseResponse from '@/utils/BaseResponse';
import { rateLimiterMiddleware } from '@/utils/utils';

const PRICE_RENAME = 100000;
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
    const { id, name } = req.body;
    if (!id || !name || name.length > 12) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Dữ liệu không hợp lệ',
        data: null
      };
      return res.status(500).json(response);
    }

    const user = verifiedToken.user_name;
    let userInfo: any;
    const characters = await dbNDGAME.getCharacterInfoByUser(user);
    await connectAndExecute(async (pool) => {
      userInfo = await getUserInfoByUsername(pool, user);
    });

    const isError = _.isEmpty(characters) || _.isEmpty(userInfo);

    if (isError) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Dữ liệu không hợp lệ',
        data: null
      };
      return res.status(500).json(response);
    }

    const exists = _.some(characters, { unique_id: Number(id) });
    if (!exists) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Dữ liệu không hợp lệ',
        data: null
      };
      return res.status(500).json(response);
    }

    const isOnline = await NineDragonsAccount.checkOnline(user);
    if (isOnline && isOnline?.cur_state) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Tài khoản đăng đăng nhập, vui lòng thoát tài khoản trước khi thực hiện!',
        data: null
      };
      return res.status(500).json(response);
    }

    const checkMoneyAvailable = userInfo && Number(userInfo?.balance || 0) >= PRICE_RENAME;

    if (!checkMoneyAvailable) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Số dư không đủ',
        data: null
      };
      return res.status(500).json(response);
    }

    const isExists = await dbNDGAME.checkCharacterExists(name);
    if (isExists) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Tên đã tồn tại, vui lòng chọn tên khác!',
        data: null
      };
      return res.status(500).json(response);
    }

    const statusSubTract = await NineDragonsAccount.subtractBalance(user, PRICE_RENAME);
    if (!statusSubTract) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Có lỗi xảy ra vui lòng thử lại sau!',
        data: null
      };
      return res.status(500).json(response);
    }

    const payloadBlock = {
      user,
      memberGuid: isOnline?.member_guid,
      causeContent: `rename character to ${name}`
    };

    const isBlockUser = await NineDragonsAccount.blockUser(payloadBlock);
    if (!isBlockUser) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Tài khoản của bạn đã bị khoá không thể thao tác!',
        data: null
      };
      return res.status(500).json(response);
    }

    const updateName = await dbNDGAME.updateCharacterById(id, name);

    if (!updateName) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Có lỗi xảy ra vui lòng thử lại sau!',
        data: null
      };
      return res.status(500).json(response);
    }

    const response: BaseResponse = {
      status: 200,
      success: true,
      message: 'Đổi tên nhân vật thành công! bạn có vào game sau 15 phút',
      data: {
        success: true
      }
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
