// TODO: code upload file to s3

// import { NextApiRequest, NextApiResponse } from 'next';
// import { parseFormAsync } from '@/utils/helpers/formidable';
// import { File } from 'formidable';
// import { fileTypeFromFile } from 'file-type';
// import { uploadImageToS3 } from '@/libs/awsUpload';
// import BaseResponse from '@/utils/BaseResponse';
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
//
//   const { fields, files } = await parseFormAsync(req);
//   const myfile = (files.video as any as File[])[0];
//   console.log('myfile', myfile);
//   // Check if an image file was uploaded
//   if (myfile) {
//     const timestamp = Date.now();
//     const shortTimestamp = timestamp.toString().substring(6); // Lấy 6 ký tự cuối cùng
//     // Sử dụng hàm uploadImageToMinio
//
//     const bucketName = '9dcn'; // Tên bucket trong Minio
//
//     // Xác định định dạng file
//     const fileTypeResult = await fileTypeFromFile(myfile.filepath);
//
//     // Kiểm tra nếu có định dạng và lấy extension
//     const fileFormat = fileTypeResult ? fileTypeResult.ext : '';
//
//     // Sử dụng fileFormat khi đặt tên object
//     const objectName = `news${shortTimestamp}.${fileFormat}`;
//     const options = {
//       contentType: fileTypeResult ? fileTypeResult.mime : 'application/octet-stream' // ContentType từ fileType hoặc mặc định là 'application/octet-stream'
//     };
//     const linkImage = await uploadImageToS3(myfile.filepath, bucketName, objectName, options);
//     const response: BaseResponse = {
//       status: 200,
//       success: true,
//       message: 'Upload thanh cong thành công',
//       data: {
//         success: linkImage
//       }
//     };
//     return res.status(200).json(response);
//   }
// }
