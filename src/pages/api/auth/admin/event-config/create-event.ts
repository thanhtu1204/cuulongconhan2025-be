import { fileTypeFromFile } from 'file-type';
import type { File } from 'formidable';
import _, { isEmpty } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuthAdmin } from '@/libs/auth';
import { uploadImageToS3 } from '@/libs/awsUpload';
import { connectAndExecute, createEventRewards, getEventsByType } from '@/libs/NineDragonsAccount';
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

  if (
    isEmpty(fields) ||
    isEmpty(fields?.eventName) ||
    isEmpty(fields?.startTime) ||
    isEmpty(fields?.endTime) ||
    isEmpty(fields?.typeEvent) ||
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
    const { eventName = [''], startTime = [''], endTime = [''], typeEvent = [''] } = fields;
    let eventRewards;
    await connectAndExecute(async (pool) => {
      eventRewards = await getEventsByType(pool, Number(typeEvent[0]));
    });
    if (!_.isEmpty(eventRewards)) {
      const response: BaseResponse = {
        status: 500,
        success: false,
        message: 'Event đã tồn tại, vui lòng xoá event ở quản lý rồi tạo lại',
        data: null
      };
      return res.status(500).json(response);
    }

    const myfile = (files.backgroundImage as any as File[])[0];

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
        const eventData = {
          event_name: eventName[0] ?? '',
          start_time: startTime[0] ?? '',
          end_time: endTime[0] ?? '',
          background_image: linkImage,
          type_event: Number(typeEvent[0]) ?? 0
        };
        let updated;
        await connectAndExecute(async (pool) => {
          updated = await createEventRewards(pool, eventData);
        });

        if (updated) {
          const response: BaseResponse = {
            status: 200,
            success: true,
            message: `Cấu hình thành công vui lòng vào quản lý Event để xem chi tiết`,
            data: updated
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
      message: 'Tạo event thất bại',
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
