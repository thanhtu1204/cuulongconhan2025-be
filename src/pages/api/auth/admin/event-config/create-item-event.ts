import { fileTypeFromFile } from 'file-type';
import type { File } from 'formidable';
import { isEmpty } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuthAdmin } from '@/libs/auth';
import { uploadImageToS3 } from '@/libs/awsUpload';
import { connectAndExecute, createItemEventRewards } from '@/libs/NineDragonsAccount';
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

  const { fields, files } = await parseFormAsync(req);

  // const { eventId, rewardName, rewardPoint, rewardItemCode, rewardDescription } = req.body;
  if (
    isEmpty(fields) ||
    isEmpty(fields?.eventId) ||
    isEmpty(fields?.rewardName) ||
    isEmpty(fields?.rewardPoint) ||
    isEmpty(fields?.rewardItemCode) ||
    isEmpty(fields?.rewardDescription) ||
    isEmpty(files)
  ) {
    const response: BaseResponse = {
      status: 500,
      success: true,
      message: 'Dữ liệu không hợp lệ',
      data: null
    };
    return res.status(500).json(response);
  }
  try {
    const myfile = (files.rewardImage as any as File[])[0];

    const {
      eventId = [''],
      rewardName = [''],
      rewardPoint = [''],
      rewardItemCode = [''],
      rewardDescription = ['']
    } = fields;

    // Check if an image file was uploaded
    if (myfile) {
      const timestamp = Date.now();
      const shortTimestamp = timestamp.toString().substring(6); // Lấy 6 ký tự cuối cùng
      // Sử dụng hàm uploadImageToMinio

      const bucketName = '9dcn'; // Tên bucket trong Minio

      // Xác định định dạng file
      const fileTypeResult = await fileTypeFromFile(myfile.filepath);

      // Kiểm tra nếu có định dạng và lấy extension
      const fileFormat = fileTypeResult ? fileTypeResult.ext : '';

      // Sử dụng fileFormat khi đặt tên object
      const objectName = `event${shortTimestamp}.${fileFormat}`;
      const options = {
        contentType: fileTypeResult ? fileTypeResult.mime : 'application/octet-stream' // ContentType từ fileType hoặc mặc định là 'application/octet-stream'
      };
      const linkImage = await uploadImageToS3(myfile.filepath, bucketName, objectName, options);
      if (!isEmpty(linkImage)) {
        const itemEventData = {
          event_id: Number(eventId[0]) ?? 0,
          reward_name: rewardName[0] ?? '',
          required_points: Number(rewardPoint[0]) ?? 0,
          reward_item_code: Number(rewardItemCode[0]) ?? 0,
          reward_description: rewardDescription[0] ?? '',
          reward_image: linkImage ?? ''
        };
        let isSuccess;

        await connectAndExecute(async (pool) => {
          isSuccess = await createItemEventRewards(pool, itemEventData);
        });

        if (isSuccess) {
          const response: BaseResponse = {
            status: 200,
            success: true,
            message: `Thêm mốc nhận quà thành công!`,
            data: isSuccess
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
      success: false,
      message: 'Tạo item code thất bại',
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
