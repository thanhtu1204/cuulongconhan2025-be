import type { AxiosError, AxiosInstance } from 'axios';

import { API_GLOBAL_LOADING_URL } from '@/constants/apiUrl';
// eslint-disable-next-line import/no-cycle
import { store } from '@/stores';
import { loadingActions } from '@/stores/loading';
import { handleErrorCommon } from '@/utils/handleError';

const setMainInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(async (config) => {
    const isLoadingApi = Object.values(API_GLOBAL_LOADING_URL).some((item) =>
      config.url ? config.url?.includes(item) : false
    );

    if (isLoadingApi) {
      store.dispatch(loadingActions.showLoading());
    }
    const customConfigs = { ...config };

    // write code to handle request here
    return customConfigs;
  });

  instance.interceptors.response.use(
    (response) => {
      store.dispatch(loadingActions.hideLoading());
      return response.data;
    },

    // write code to handle response here
    (error: AxiosError) => {
      store.dispatch(loadingActions.hideLoading());
      // write code to handle error response
      handleErrorCommon(error);
    }
  );
};

export { setMainInterceptor };
