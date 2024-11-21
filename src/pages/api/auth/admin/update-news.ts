import type { File } from 'formidable';
import { isEmpty } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuthAdmin } from '@/libs/auth';
import { uploadImageCloudinary } from '@/libs/cloudinary';
import { addNews, connectAndExecute } from '@/libs/NineDragonsAccount';
import type BaseResponse from '@/utils/BaseResponse';
import { parseFormAsync } from '@/utils/helpers/formidable';
import { rateLimiterMiddleware, removeVietnamese } from '@/utils/utils';

export const config = {
  api: {
    bodyParser: false // enable form data
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
  try {
    // Parse request with formidable
    const { fields, files } = await parseFormAsync(req);

    if (
      !isEmpty(fields) &&
      !isEmpty(files) &&
      !isEmpty(fields?.newsTitle) &&
      !isEmpty(fields?.newsType) &&
      !isEmpty(fields?.newsDescriptions) &&
      !isEmpty(fields?.newsContent) &&
      !isEmpty(fields?.newsId)
    ) {
      const myfile = (files.newsImages as any as File[])[0];
      const {
        newsTitle = [''],
        newsType = [''],
        newsDescriptions = [''],
        newsContent = [''],
        newsId = ['']
      } = fields;
      // Check if an image file was uploaded
      if (myfile) {
        const urlImage = await uploadImageCloudinary(myfile.filepath);
        if (urlImage) {
          const news = {
            newsId: newsId[0] ?? '',
            newsTitle: newsTitle[0] ?? '',
            newsAscii: removeVietnamese(newsTitle[0] || '') ?? '',
            newsImages: urlImage ?? '',
            newsType: Number(newsType[0]) ?? 0,
            newsDescriptions: newsDescriptions[0],
            newsContent: newsContent[0]
          };
          let data;
          await connectAndExecute(async (pool) => {
            data = await addNews(pool, news);
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
        }
        const response: BaseResponse = {
          status: 500,
          success: true,
          message: 'Upload ảnh lỗi',
          data: {
            success: false
          }
        };
        return res.status(500).json(response);
      }
      const response: BaseResponse = {
        status: 500,
        success: true,
        message: 'Không thấy file ảnh',
        data: {
          success: false
        }
      };
      return res.status(500).json(response);
    }

    const response: BaseResponse = {
      status: 500,
      success: true,
      message: 'Lỗi dữ liệu',
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
