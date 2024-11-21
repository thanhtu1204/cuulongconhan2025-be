import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuthAdmin } from '@/libs/auth';
import { createGuidebookData } from '@/libs/mongooDb';
import type BaseResponse from '@/utils/BaseResponse';
import { parseFormLargeAsync } from '@/utils/helpers/formidableLageSize';
import { rateLimiterMiddleware } from '@/utils/utils';

export const config = {
  api: {
    bodyParser: false, // enable form data
    responseLimit: false
  }
};

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
  const { fields } = await parseFormLargeAsync(req);

  // Kiểm tra có tồn tại hay không
  if (_.isEmpty(fields?.title) || _.isEmpty(fields?.contentHtml) || _.isEmpty(fields?.type)) {
    const response: BaseResponse = {
      status: 500,
      success: true,
      message: 'Vui lòng điền đầy đủ thông tin',
      data: null
    };
    return res.status(500).json(response);
  }

  try {
    const { title = [''], contentHtml = [''], type = [''] } = fields;

    const resCreate = await createGuidebookData(
      title[0] ?? '',
      contentHtml[0] ?? '',
      type[0] ?? ''
    );

    if (resCreate) {
      const response: BaseResponse = {
        status: 200,
        success: true,
        message: 'Thêm bài đăng thành công',
        data: {
          data: resCreate
        }
      };
      return res.status(200).json(response);
    }
    const response: BaseResponse = {
      status: 500,
      success: true,
      message: 'err',
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
