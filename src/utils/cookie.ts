import { addMonths } from 'date-fns';
import Cookies from 'universal-cookie';

import { CookieKey } from '@/utils/constant';
import { getCurrentDomain } from '@/utils/utils';

const cookies = new Cookies();
export const CookiesStorage = {
  getCookieData(key: string) {
    return cookies.get(key);
  },
  setCookieData(key: string, data: any) {
    const domain = getCurrentDomain();
    const currentTime = new Date();
    const expires = addMonths(currentTime, 1);
    cookies.set(key, data, { domain, expires, path: '/' });
  },
  clearCookieData(key: string) {
    const domain = getCurrentDomain();
    cookies.remove(key, { domain, path: '/' });
  },
  getToken() {
    return cookies.get(CookieKey.token);
  },

  setToken(accessToken: string) {
    const domain = getCurrentDomain();
    const currentTime = new Date();
    const expires = addMonths(currentTime, 1);
    cookies.set(CookieKey.token, accessToken, {
      domain,
      expires,
      path: '/'
    });
  },
  clearData() {
    const domain = getCurrentDomain();
    cookies.remove(CookieKey.token, { domain });
  },

  authenticated() {
    const accessToken = cookies.get(CookieKey.token);
    // todo more case - ext: check expired time
    return accessToken !== undefined;
  }
};
