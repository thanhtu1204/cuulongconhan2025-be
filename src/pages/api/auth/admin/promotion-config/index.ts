import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuthAdmin } from '@/libs/auth';
import { connectAndExecute, createAndUpdatePromotionConfigV1 } from '@/libs/NineDragonsAccount';
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

  const { minAmount, maxAmount, discountPercentage, startDate, endDate } = req.body;
  // Kiểm tra có tồn tại hay không
  if (!minAmount || !maxAmount || !discountPercentage || !startDate || !endDate) {
    const response: BaseResponse = {
      status: 500,
      success: true,
      message: 'Vui lòng điền đầy đủ thông tin',
      data: null
    };
    return res.status(500).json(response);
  }

  // Kiểm tra định dạng hợp lệ
  if (
    typeof minAmount !== 'number' ||
    typeof maxAmount !== 'number' ||
    typeof discountPercentage !== 'number'
  ) {
    const response: BaseResponse = {
      status: 500,
      success: true,
      message: 'MinAmount, maxAmount, discountPercentage phải là số',
      data: null
    };
    return res.status(500).json(response);
  }

  // Kiểm tra giá trị tối thiểu và tối đa
  if (minAmount < 0 || maxAmount < 0 || discountPercentage < 0) {
    const response: BaseResponse = {
      status: 500,
      success: true,
      message: 'MinAmount, maxAmount, discountPercentage phải là số không âm',
      data: null
    };
    return res.status(500).json(response);
  }

  // Kiểm tra logic hợp lệ giữa các trường (ví dụ: startDate không lớn hơn endDate)
  if (new Date(startDate) > new Date(endDate)) {
    const response: BaseResponse = {
      status: 500,
      success: true,
      message: 'Ngày bắt đầu không được lớn hơn ngày kết thúc',
      data: null
    };
    return res.status(500).json(response);
  }

  try {
    let update;
    await connectAndExecute(async (pool) => {
      update = await createAndUpdatePromotionConfigV1(pool, req.body);
    });

    const response: BaseResponse = {
      status: 200,
      success: true,
      message: 'Cấu hình thành công',
      data: {
        data: update
      }
    };
    return res.status(200).json(response);
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
