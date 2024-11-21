// import { fileTypeFromFile } from 'file-type';
// import type { File } from 'formidable';
// import { isEmpty } from 'lodash';
// import type { NextApiRequest, NextApiResponse } from 'next';
//
// import { verifyAuthAdmin } from '@/libs/auth';
// import { uploadImageToS3 } from '@/libs/awsUpload';
// import { addNews, connectAndExecute } from '@/libs/NineDragonsAccount';
// import type BaseResponse from '@/utils/BaseResponse';
// import { parseFormAsync } from '@/utils/helpers/formidable';
// import { rateLimiterMiddleware, removeVietnamese } from '@/utils/utils';
//
// export const config = {
//   api: {
//     bodyParser: false // enable form data
//   }
// };
//
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ status: 405, error: 'Method Not Allowed' });
//   }
//   const clientIp = req.socket.remoteAddress;
//   const isAllowed = rateLimiterMiddleware(clientIp ?? '') || false;
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(' ')[1];
//
//   const verifiedToken = token && (await verifyAuthAdmin(token).catch(() => {}));
//   if (!isAllowed) {
//     return res
//       .status(429)
//       .json({ status: 429, message: 'Yêu cầu quá nhanh, vui lòng thử lại sau.' });
//   }
//
//   if (!verifiedToken) {
//     return res.status(401).json({
//       status: 401,
//       message: 'Phiên đăng nhập hết hạn hoặc không có quyền thao tác',
//       data: null
//     });
//   }
//   try {
//     // Parse request with formidable
//     const { fields, files } = await parseFormAsync(req);
//
//     if (
//       !isEmpty(fields) &&
//       !isEmpty(files) &&
//       !isEmpty(fields?.newsTitle) &&
//       !isEmpty(fields?.type) &&
//       !isEmpty(fields?.newsDescriptions) &&
//       !isEmpty(fields?.newsContent)
//     ) {
//       const myfile = (files.newsImages as any as File[])[0];
//       const {
//         newsTitle = [''],
//         type = [''],
//         newsDescriptions = [''],
//         newsContent = ['']
//       } = fields;
//
//       // Check if an image file was uploaded
//       if (myfile) {
//         const timestamp = Date.now();
//         const shortTimestamp = timestamp.toString().substring(6); // Lấy 6 ký tự cuối cùng
//         // Sử dụng hàm uploadImageToMinio
//
//         const bucketName = '9dcn'; // Tên bucket trong Minio
//
//         // Xác định định dạng file
//         const fileTypeResult = await fileTypeFromFile(myfile.filepath);
//
//         // Kiểm tra nếu có định dạng và lấy extension
//         const fileFormat = fileTypeResult ? fileTypeResult.ext : '';
//
//         // Sử dụng fileFormat khi đặt tên object
//         const objectName = `news${shortTimestamp}.${fileFormat}`;
//         const options = {
//           contentType: fileTypeResult ? fileTypeResult.mime : 'application/octet-stream' // ContentType từ fileType hoặc mặc định là 'application/octet-stream'
//         };
//         const linkImage = await uploadImageToS3(myfile.filepath, bucketName, objectName, options);
//         if (!isEmpty(linkImage)) {
//           const news = {
//             newsTitle: newsTitle[0] ?? '',
//             newsAscii: removeVietnamese(newsTitle[0] || '') ?? '',
//             newsImages: linkImage ?? '',
//             type: Number(type[0]) ?? 0,
//             newsDescriptions: newsDescriptions[0],
//             newsContent: newsContent[0]
//           };
//           let data;
//           await connectAndExecute(async (pool) => {
//             data = await addNews(pool, news);
//           });
//           if (data) {
//             const response: BaseResponse = {
//               status: 200,
//               success: true,
//               message: 'Thêm tin thành công',
//               data: {
//                 success: data
//               }
//             };
//             return res.status(200).json(response);
//           }
//           const response: BaseResponse = {
//             status: 500,
//             success: true,
//             message: 'Upload dữ liệu lỗi!',
//             data: {
//               success: false
//             }
//           };
//           return res.status(500).json(response);
//         }
//         const response: BaseResponse = {
//           status: 500,
//           success: true,
//           message: 'Upload ảnh lỗi',
//           data: {
//             success: false
//           }
//         };
//         return res.status(500).json(response);
//       }
//       const response: BaseResponse = {
//         status: 500,
//         success: true,
//         message: 'Không thấy file ảnh',
//         data: {
//           success: false
//         }
//       };
//       return res.status(500).json(response);
//     }
//
//     const response: BaseResponse = {
//       status: 500,
//       success: true,
//       message: 'Lỗi dữ liệu',
//       data: {
//         success: false
//       }
//     };
//     return res.status(500).json(response);
//   } catch (e) {
//     const response: BaseResponse = {
//       status: 500,
//       success: true,
//       message: e?.message,
//       data: {
//         success: false
//       }
//     };
//     return res.status(500).json(response);
//   }
// }

import { fileTypeFromFile } from 'file-type';
import type { File } from 'formidable';
import { isEmpty } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyAuthAdmin } from '@/libs/auth';
import { uploadImageToS3 } from '@/libs/awsUpload';
import { createNews } from '@/libs/mongo/controller/NewsController';
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

    // Validate the required fields
    if (
      isEmpty(fields.titleVi) ||
      isEmpty(fields.titleEn) ||
      isEmpty(fields.type) ||
      isEmpty(fields.description) ||
      isEmpty(fields.contentVi) ||
      isEmpty(fields.contentEn)
    ) {
      return res.status(400).json({
        status: 400,
        message: 'Dữ liệu không hợp lệ, thiếu trường bắt buộc',
        data: null
      });
    }

    const {
      titleVi = [''],
      titleEn = [''],
      type = [''],
      description = [''],
      contentVi = [''],
      contentEn = ['']
    } = fields;

    const myFileVi = (files.imageVi as any as File[])[0];
    const myFileEn = (files.imageEn as any as File[])[0];

    // Validate the presence of images for both Vietnamese and English
    if (!myFileVi || !myFileEn) {
      return res.status(400).json({
        status: 400,
        message: 'Cần phải tải lên ảnh cho cả tiếng Việt và tiếng Anh',
        data: null
      });
    }

    // Upload Vietnamese image to S3
    const linkImageVi = await uploadImageToS3File(myFileVi);
    if (!linkImageVi) {
      return res.status(500).json({
        status: 500,
        message: 'Tải lên ảnh tiếng Việt thất bại',
        data: null
      });
    }

    // Upload English image to S3
    const linkImageEn = await uploadImageToS3File(myFileEn);
    if (!linkImageEn) {
      return res.status(500).json({
        status: 500,
        message: 'Tải lên ảnh tiếng Anh thất bại',
        data: null
      });
    }

    // Construct the news data object
    const news = {
      title: {
        vi: titleVi[0] ?? '',
        en: titleEn[0] ?? ''
      },
      ascii: removeVietnamese(String(titleVi[0] ?? '')),
      images: [linkImageVi, linkImageEn],
      type: Number(type),
      descriptions: {
        vi: description[0] ?? '',
        en: description[0] ?? ''
      },
      content: {
        vi: contentVi[0] ?? '',
        en: contentEn[0] ?? ''
      },
      created_by: 'Admin',
      delete_flag: false
    };

    // Use the createNews function to save the new news
    const newNews = await createNews(news);

    const response: BaseResponse = {
      status: 200,
      success: true,
      message: 'Thêm tin thành công',
      data: {
        success: true,
        newNews
      }
    };
    return res.status(200).json(response);
  } catch (e) {
    const response: BaseResponse = {
      status: 500,
      success: false,
      message: e?.message,
      data: null
    };
    return res.status(500).json(response);
  }
}

// Helper function to upload image to S3
async function uploadImageToS3File(file: File): Promise<string | null> {
  try {
    const timestamp = Date.now();
    const shortTimestamp = timestamp.toString().substring(6);
    const bucketName = '9dcn'; // Replace with your bucket name

    const fileTypeResult = await fileTypeFromFile(file.filepath);
    const fileFormat = fileTypeResult ? fileTypeResult.ext : 'jpg';
    const objectName = `news-${shortTimestamp}.${fileFormat}`;
    const options = {
      contentType: fileTypeResult ? fileTypeResult.mime : 'application/octet-stream'
    };

    const linkImage = await uploadImageToS3(file.filepath, bucketName, objectName, options);
    return linkImage;
  } catch (err) {
    console.error('Error uploading image:', err);
    return null;
  }
}
