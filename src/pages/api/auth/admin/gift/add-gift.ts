import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuthAdmin } from '@/libs/auth';
import { addMultipleGiftCodes, connectAndExecute } from '@/libs/NineDragonsAccount';
import type BaseResponse from '@/utils/BaseResponse';
import { generateGiftCodeList, rateLimiterMiddleware } from '@/utils/utils';

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
  try {
    // Parse request with formidable
    const { count, itemCode, expriedDate } = req.body;
    if (!count || !itemCode || !expriedDate) {
      return res.status(500).json({
        status: 500,
        success: true,
        message: 'Sai dữ liệu',
        data: {
          success: false
        }
      });
    }
    const item = { itemCode, expriedDate };

    const listGift = generateGiftCodeList(count);
    let data;

    // const data = { count, itemCode, expriedDate, listGift };
    await connectAndExecute(async (pool) => {
      data = await addMultipleGiftCodes(pool, item, listGift);
    });
    if (data) {
      const response: BaseResponse = {
        status: 200,
        success: true,
        message: 'Thêm tin thành công',
        data: {
          success: data
        }
      };
      return res.status(200).json(response);
    }
    const response: BaseResponse = {
      status: 500,
      success: true,
      message: 'Upload dữ liệu lỗi!',
      data: {
        success: false
      }
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
