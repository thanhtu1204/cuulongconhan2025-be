import type { AxiosError } from 'axios';
import Router from 'next/router';
import { toast } from 'react-toastify';

import { API_ERROR_MAPPING, APIStatusCode } from '@/constants/errorMessages';
import type { InnerError } from '@/types/error';

/**
 * @Description
 * Error handler common
 */
const handleErrorCommon = (error: any) => {
  const httpCode = error?.response?.status;
  const mess = error?.response?.data?.message;

  if (httpCode) {
    // The request was made and the server responded with a status code
    if (httpCode >= APIStatusCode.INTERNAL_SERVER) {
      toast.error(mess || API_ERROR_MAPPING[APIStatusCode.INTERNAL_SERVER]);
    } else if (httpCode === APIStatusCode.RATE_LIMIT) {
      toast.error(mess || API_ERROR_MAPPING[APIStatusCode.RATE_LIMIT] || '');
    } else if (httpCode === APIStatusCode.UNAUTHORIZED) {
      Router.replace('/login');
      toast.error(mess || API_ERROR_MAPPING[APIStatusCode.UNAUTHORIZED] || '');
    } else if (httpCode === APIStatusCode.FORBIDDEN) {
      toast.error(mess || API_ERROR_MAPPING[APIStatusCode.FORBIDDEN] || '');
    } else {
      toast.error(mess || API_ERROR_MAPPING[APIStatusCode.ERR_BAD_REQUEST] || '');
    }
  }
};

const handleErrorWithInnerMessage = (error: AxiosError<InnerError>) => {
  const messageCode = error?.response?.data?.status?.message ?? '';

  toast.error(messageCode);
};

export { handleErrorCommon, handleErrorWithInnerMessage };
