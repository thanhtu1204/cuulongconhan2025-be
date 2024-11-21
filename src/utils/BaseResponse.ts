// BaseResponse.ts

interface BaseResponse {
  status: number;
  success: boolean;
  message: string;
  data?: any;
}

export default BaseResponse;
