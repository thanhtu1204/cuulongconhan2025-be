import type { AdminState } from '@/constants/admin';
import { API_URL } from '@/constants/apiUrl';
import { http } from '@/services/axiosInstances';
import { store } from '@/stores';
import type { IDashBoard, IGiftList } from '@/types/adminTypes';
import type { IAllPromotions, INewsList } from '@/types/homeTypes';

export const adminLogin = async (username: string, password: string) => {
  const payload = {
    username,
    password
  };

  return http.post<AdminState>(API_URL.ADMIN_LOGIN, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const addConfigLinkGame = async (payload: any) => {
  const state = store.getState();
  const { accessToken } = state.admin;

  const { linkEn, linkVi } = payload;
  const payloadData = {
    linkEn,
    linkVi
  };
  return http.post<AdminState>(API_URL.ADD_LINK_DOWNLOAD, payloadData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const adminCreateNews = async (news: any) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const formData = new FormData();

  Object.keys(news).forEach((key) => {
    const value = news[key];
    // Kiểm tra xem giá trị có phải là chuỗi hoặc Blob không và không phải là undefined
    if (value !== undefined && (typeof value === 'string' || value instanceof Blob)) {
      formData.append(key, value);
    }
  });

  return http.post<AdminState>(API_URL.ADMIN_ADD_NEWS, news, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const getListNewsAll = async () => {
  const state = store.getState();
  const { accessToken } = state.admin;

  return http.get<INewsList>(API_URL.LIST_NEW_FULL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};
export const getListProductAll = async () => {
  const state = store.getState();
  const { accessToken } = state.admin;

  return http.get<INewsList>(API_URL.LIST_PRODUCT_FULL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const hideNews = async (id: string) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const payload = {
    id
  };
  return http.post<INewsList>(API_URL.HIDE_NEWS, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};
export const showNews = async (id: string) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const payload = {
    id
  };
  return http.post<INewsList>(API_URL.SHOW_NEWS, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};
export const deleteNews = async (id: string) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const payload = {
    id
  };
  return http.post<INewsList>(API_URL.DELETE_NEWS, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};
export const hideItem = async (id: string) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const payload = {
    id
  };
  return http.post<INewsList>(API_URL.HIDE_ITEM, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};
export const deleteItem = async (id: string) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const payload = {
    id
  };
  return http.post<INewsList>(API_URL.DELETE_ITEM, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const deleteItemBonus = async (id: string) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const payload = {
    id
  };
  return http.post<INewsList>(API_URL.DELETE_ITEM_BONUS, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const showItem = async (id: string) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const payload = {
    id
  };
  return http.post<INewsList>(API_URL.SHOW_ITEM, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const adminCreateItem = async (item: any) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const formData = new FormData();
  Object.keys(item).forEach((key) => {
    const value = item[key];
    // Kiểm tra xem giá trị có phải là chuỗi hoặc Blob không và không phải là undefined
    if (value !== undefined && (typeof value === 'string' || value instanceof Blob)) {
      formData.append(key, value);
    }
  });

  return http.post<AdminState>(API_URL.ADMIN_ADD_ITEM, item, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  });
};
export const adminCreateBonusItem = async (item: any) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const formData = new FormData();
  Object.keys(item).forEach((key) => {
    const value = item[key];
    // Kiểm tra xem giá trị có phải là chuỗi hoặc Blob không và không phải là undefined
    if (value !== undefined && (typeof value === 'string' || value instanceof Blob)) {
      formData.append(key, value);
    }
  });

  return http.post<AdminState>(API_URL.ADMIN_ADD_ITEM_BONUS, item, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const getDashBoard = async () => {
  const state = store.getState();
  const { accessToken } = state.admin;

  return http.get<IDashBoard>(API_URL.DASHBOARD, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const getListGiftCodeAll = async () => {
  const state = store.getState();
  const { accessToken } = state.admin;

  return http.get<IGiftList>(API_URL.LIST_GIFT_FULL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const activeGift = async (id: string) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const payload = {
    id
  };
  return http.post<INewsList>(API_URL.ACTIVE_GIFT, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};
export const deleteGift = async (id: string) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const payload = {
    id
  };
  return http.post<INewsList>(API_URL.DELETE_GIFT, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};
export const inActiveGift = async (id: string) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const payload = {
    id
  };
  return http.post<INewsList>(API_URL.INACTIVE_GIFT, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const adminCreateGiftCode = async (gifts: any) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const payload = { ...gifts };

  return http.post<AdminState>(API_URL.ADMIN_ADD_GIFT, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const addConfigPromotion = async (payload: any) => {
  const state = store.getState();
  const { accessToken } = state.admin;

  return http.post<AdminState>(API_URL.ADD_CONFIG_PROMOTION, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const getAllPromotion = async () => {
  const state = store.getState();
  const { accessToken } = state.admin;

  return http.get<IAllPromotions>(API_URL.GET_ALL_PROMOTIONS, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};
export const addMoneyByUserName = async (payload: any) => {
  const state = store.getState();
  const { accessToken } = state.admin;

  return http.post<IAllPromotions>(API_URL.ADD_MONEY_BY_USER_NAME, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const addBonusMoneyByUserName = async (payload: any) => {
  const state = store.getState();
  const { accessToken } = state.admin;

  return http.post<IAllPromotions>(API_URL.ADD_BONUS_MONEY_BY_USER_NAME, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const userBalanceHistoryApi = async (type: string) => {
  const state = store.getState();
  const { accessToken } = state.admin;

  return http.get<IAllPromotions>(`${API_URL.GET_ALL_USER_BALANCE}?type=${type}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};
export const adminCreateGuidebook = async (payload: any) => {
  const state = store.getState();
  const { accessToken } = state.admin;

  const formData = new FormData();

  Object.keys(payload).forEach((key) => {
    const value = payload[key];
    // Kiểm tra xem giá trị có phải là chuỗi hoặc Blob không và không phải là undefined
    if (value !== undefined && typeof value === 'string') {
      formData.append(key, value);
    }
  });

  return http.post(API_URL.ADD_GUIDE_BOOK, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const deleteGuideBook = async (id: string) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const payload = {
    id
  };
  return http.post(API_URL.DELETE_GUIDE_BOOK, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const apiAdminAddEventRewards = async (news: any) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const formData = new FormData();

  Object.keys(news).forEach((key) => {
    const value = news[key];
    // Kiểm tra xem giá trị có phải là chuỗi hoặc Blob không và không phải là undefined
    if (value !== undefined && (typeof value === 'string' || value instanceof Blob)) {
      formData.append(key, value);
    }
  });

  return http.post<AdminState>(API_URL.ADMIN_ADD_EVENT_REWARDS, news, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const apiGetAllEventRewards = async () => {
  const state = store.getState();
  const { accessToken } = state.admin;

  return http.get<IAllPromotions>(API_URL.ADMIN_GET_ALL_EVENT_REWARDS, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const apiDeleteEventRewardsById = async (id: string) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const payload = {
    id
  };
  return http.post(API_URL.ADMIN_DELETE_EVENT_REWARDS, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const apiAdminAddItemEventRewards = async (news: any) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const formData = new FormData();

  Object.keys(news).forEach((key) => {
    const value = news[key];
    // Kiểm tra xem giá trị có phải là chuỗi hoặc Blob không và không phải là undefined
    if (value !== undefined && (typeof value === 'string' || value instanceof Blob)) {
      formData.append(key, value);
    }
  });

  return http.post<AdminState>(API_URL.ADMIN_ADD_ITEM_EVENT_REWARDS, news, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const apiGetAllItemEventRewards = async () => {
  const state = store.getState();
  const { accessToken } = state.admin;

  return http.get<IAllPromotions>(API_URL.ADMIN_GET_ALL_ITEM_EVENT_REWARDS, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const apiDeleteItemEventRewardsById = async (id: string) => {
  const state = store.getState();
  const { accessToken } = state.admin;
  const payload = {
    id
  };
  return http.post(API_URL.ADMIN_DELETE_ITEM_EVENT_REWARDS, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const cronInDashBoard = async () => {
  return http.get<IDashBoard>(API_URL.CRON_DASHBOARD, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ABCXCCXAAAA@123@22123CLCNCHECK2025`
    }
  });
};

export const getListItemBonusAll = async () => {
  const state = store.getState();
  const { accessToken } = state.admin;

  return http.get<INewsList>(API_URL.LIST_ITEM_BONUS_FULL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
};
