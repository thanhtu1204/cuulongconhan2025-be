import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: 'conhan.io.vn', // Thay thế bằng địa chỉ Minio server của bạn
  port: 9000,
  useSSL: false,
  accessKey: 'W3nhNWRHhm5bYmyeG0mH', // Thay thế bằng access key của bạn
  secretKey: 'YU6Z7z0fio4amicRxQ2rl51oIOVhd8EkhmrkOYgc' // Thay thế bằng secret key của bạn
});

export const uploadImageToMinio = async (
  filePath: string,
  bucketName: string,
  objectName: string,
  options: any
) => {
  try {
    const upload = await minioClient.fPutObject(bucketName, objectName, filePath, options);
    if (upload && upload?.etag) {
      return upload;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
};
