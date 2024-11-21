// // chan dang ky
//
// import type { NextApiRequest, NextApiResponse } from 'next';
//
// import type BaseResponse from '@/utils/BaseResponse';
// import { rateLimiterMiddleware } from '@/utils/utils';
//
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ status: 405, error: 'Method Not Allowed' });
//   }
//   const clientIp = req.socket.remoteAddress;
//   const isAllowed = rateLimiterMiddleware(clientIp ?? '') || false;
//   if (!isAllowed) {
//     return res
//       .status(429)
//       .json({ status: 429, message: 'Yêu cầu quá nhanh, vui lòng thử lại sau.' });
//   }
//   const response: BaseResponse = {
//     status: 500,
//     success: false,
//     message: 'Tạm thời chưa được phép đăng ký! vui lòng thử lại sau',
//     data: null
//   };
//   return res.status(500).json(response);
// }

import type { NextApiRequest, NextApiResponse } from 'next';

import NineDragonsAccount from '@/libs/dbNineDragonsAccount';
import type BaseResponse from '@/utils/BaseResponse';
import { rateLimiterMiddleware } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 405, error: 'Method Not Allowed' });
  }
  const clientIp = req.socket.remoteAddress;
  const isAllowed = rateLimiterMiddleware(clientIp ?? '') || false;
  if (!isAllowed) {
    return res
      .status(429)
      .json({ status: 429, message: 'Yêu cầu quá nhanh, vui lòng thử lại sau.' });
  }

  const { username, password, telephone, email, address, fullname } = req.body;

  if (username.length < 6 || username.length > 50) {
    const response = {
      status: 500,
      success: true,
      message: 'Tên người dùng phải có từ 6 đến 50 ký tự.',
      data: null
    };
    return res.status(500).json(response);
  }

  // Kiểm tra password
  if (password.length < 6 || password.length > 50) {
    const response = {
      status: 500,
      success: true,
      message: 'Mật khẩu phải có từ 6 đến 50 ký tự.',
      data: null
    };
    return res.status(500).json(response);
  }

  // Kiểm tra telephone
  if (!/(0[3|5|7|8|9])+([0-9]{8})\b/g.test(telephone)) {
    const response = {
      status: 500,
      success: true,
      message: 'Số điện thoại không hợp lệ.',
      data: null
    };
    return res.status(500).json(response);
  }

  // Kiểm tra email
  if (!/\S+@\S+\.\S+/.test(email)) {
    const response = {
      status: 500,
      success: true,
      message: 'Email không hợp lệ.',
      data: null
    };
    return res.status(500).json(response);
  }

  // Kiểm tra address
  if (address.length === 0) {
    const response = {
      status: 500,
      success: true,
      message: 'Địa chỉ là bắt buộc.',
      data: null
    };
    return res.status(500).json(response);
  }

  // Kiểm tra fullname
  if (fullname.length < 2 || fullname.length > 50) {
    const response = {
      status: 500,
      success: true,
      message: 'Họ và tên phải có từ 2 đến 50 ký tự.',
      data: null
    };
    return res.status(500).json(response);
  }

  try {
    const isEmailExist = await NineDragonsAccount.checkUserExistByEmail(email);
    const isPhoneExist = await NineDragonsAccount.checkUserExistByPhone(telephone);
    if (isPhoneExist) {
      return res.status(500).json({
        status: 500,
        message: 'Số điện thoại đã được sử dụng để đăng ký!'
      });
    }
    if (isEmailExist) {
      return res.status(500).json({
        status: 404,
        message: 'Email  đã được sử dụng để đăng ký!'
      });
    }

    const login = await NineDragonsAccount.register(req.body);
    if (!login) {
      return res.status(404).json({
        status: 404,
        error: 'Tài khoản đã tồn tại vui lòng đặt tên tài khoản khác!'
      });
    }

    const response: BaseResponse = {
      status: 200,
      success: true,
      message: 'Tạo tài khoản thành công',
      data: {
        success: true
      }
    };
    return res.status(200).json(response);
  } catch (error) {
    const errorString = (error as Error).message; // Type assertion to tell TypeScript it's an Error

    const response: BaseResponse = {
      status: 500,
      success: false,
      message: errorString,
      data: null
    };
    return res.status(500).json(response);
  }
}
