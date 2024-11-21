import axios from 'axios';

import { Env } from '@/libs/Env.mjs';

interface VietQRResponse {
  // Define your response interfaces here
}

const clientID = Env.VIETQR_CLIENT_ID;
const apiKey = Env.VIETQR_API_KEY;
const apiUrl = 'https://api.vietqr.io';
const message = 'Please check your API key and client key';
const checkKey = () => clientID !== '' && apiKey !== '';
const axiosInstance = axios.create({
  // Các cấu hình khác của Axios
  baseURL: 'https://api.vietqr.io',
  headers: {
    'x-client-id': clientID,
    'x-api-key': apiKey,
    'Content-Type': 'application/json'
  }
});
const postData = async (url: string, data: any) => {
  if (!checkKey()) return message;
  try {
    const response = await axiosInstance.post(url, data);
    return response.data as VietQRResponse;
  } catch (err) {
    return err;
  }
};

export const generateQrByID = async (id: string) => {
  const payload = {
    accountNo: Env.BANK_NUMBER,
    accountName: 'DANG QUY THUONG',
    acqId: 970422,
    addInfo: `NAP9D${id}CONHAN`,
    template: '0vJLgUB'
  };

  const data = await postData(`${apiUrl}/v2/generate`, payload);
  if (data) {
    return data;
  }
  return null;
};
