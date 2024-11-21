import cloudinary from 'cloudinary';

import { Env } from '@/libs/Env.mjs';

cloudinary.v2.config({
  cloud_name: Env.CLOUDINARY_CLOUD_NAME,
  api_key: Env.CLOUDINARY_API_KEY,
  api_secret: Env.CLOUDINARY_API_SECRET
});

export const uploadImageCloudinary = async (imageData: string): Promise<string | null> => {
  try {
    // Tải ảnh lên Cloudinary
    const result = await cloudinary.v2.uploader.upload(imageData, {
      folder: 'news' // Thay đổi tên thư mục tùy ý
    });

    // Trả về đường dẫn ảnh từ Cloudinary
    return result.secure_url;
  } catch (error) {
    throw new Error('Upload image to Cloudinary failed');
  }
};
