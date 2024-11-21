import axios from 'axios';

import { setMainInterceptor } from '@/services/interceptors';

const headers: { 'Content-Type': string } = { 'Content-Type': 'application/json' };

const http = axios.create({
  headers,
  timeout: 10000,
  maxContentLength: 30 * 1024 * 1024,
  maxBodyLength: 30 * 1024 * 1024
});

setMainInterceptor(http);

export { http };
