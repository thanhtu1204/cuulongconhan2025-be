import { API_URL } from '@/constants/apiUrl';
import { http } from '@/services/axiosInstances';
import type { ILinkDownload, INewsList } from '@/types/homeTypes';

export const getListNews = async () => {
  return http.get<INewsList>(API_URL.NEWS, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const getLinkGame = async () => {
  return http.get<ILinkDownload>(API_URL.GET_LINK_DOWNLOAD, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const getGuideBook = async (id: string) => {
  return http.post(
    API_URL.GET_GUIDE_BOOK_ID,
    { id },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
