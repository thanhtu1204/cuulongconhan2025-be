import { fileTypeFromFile } from 'file-type';
import type { File } from 'formidable';
import { isEmpty } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuthAdmin } from '@/libs/auth';
import { uploadImageToS3 } from '@/libs/awsUpload';
import DbCis from '@/libs/dbCis';
import type BaseResponse from '@/utils/BaseResponse';
import { parseFormAsync } from '@/utils/helpers/formidable';
import { rateLimiterMiddleware } from '@/utils/utils';

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
      !isEmpty(fields?.itemCategory) &&
      !isEmpty(fields?.itemCode) &&
      !isEmpty(fields?.name) &&
      !isEmpty(fields?.descriptions) &&
      !isEmpty(fields?.price)
    ) {
      const myfile: any = (files.image as any as File[])[0];
      const {
        itemCategory = [''],
        itemCode = [''],
        name = [''],
        descriptions = [''],
        price = ['']
      } = fields;
      // Check if an image file was uploaded
      if (myfile) {
        const timestamp = Date.now();
        const shortTimestamp = timestamp.toString().substring(6); // Lấy 6 ký tự cuối cùng
        const bucketName = '9dcn'; // Tên bucket trong Minio

        // Xác định định dạng file
        const fileTypeResult = await fileTypeFromFile(myfile.filepath);

        // Kiểm tra nếu có định dạng và lấy extension
        const fileFormat = fileTypeResult ? fileTypeResult.ext : '';

        // Sử dụng fileFormat khi đặt tên object
        const objectName = `${shortTimestamp}.${fileFormat}`;
        const options = {
          contentType: fileTypeResult ? fileTypeResult.mime : 'application/octet-stream' // ContentType từ fileType hoặc mặc định là 'application/octet-stream'
        };
        const linkImage = await uploadImageToS3(myfile.filepath, bucketName, objectName, options);
        if (!isEmpty(linkImage)) {
          const item = {
            item_category: Number(itemCategory[0]) ?? 0,
            item_code: Number(itemCode[0]) ?? '',
            item_price: Number(price[0] || 1000000) ?? 0,
            item_day: 0,
            item_quantity: 1,
            item_status: 2,
            item_name: name[0] ?? '',
            item_description: descriptions[0] ?? '',
            item_image: linkImage ?? '',
            key_word: 'D',
            is_present: 0
          };
          const statusAddItem = await DbCis.addItem(item);

          if (statusAddItem) {
            const response: BaseResponse = {
              status: 200,
              success: true,
              message: 'Thêm Vật phẩm thành công',
              data: {
                success: statusAddItem
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
