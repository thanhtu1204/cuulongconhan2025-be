import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { get } from 'lodash';

import { ADMIN_STORE, DEFAULT_ADMIN_STATE } from '@/constants/admin';
import {
  activeGift,
  addBonusMoneyByUserName,
  addConfigLinkGame,
  addConfigPromotion,
  addMoneyByUserName,
  adminCreateBonusItem,
  adminCreateGiftCode,
  adminCreateGuidebook,
  adminCreateItem,
  adminCreateNews,
  adminLogin,
  apiAdminAddEventRewards,
  apiAdminAddItemEventRewards,
  apiDeleteEventRewardsById,
  apiDeleteItemEventRewardsById,
  apiGetAllEventRewards,
  apiGetAllItemEventRewards,
  cronInDashBoard,
  deleteGift,
  deleteGuideBook,
  deleteItem,
  deleteItemBonus,
  deleteNews,
  getAllPromotion,
  getDashBoard,
  getListGiftCodeAll,
  getListItemBonusAll,
  getListNewsAll,
  getListProductAll,
  hideItem,
  hideNews,
  inActiveGift,
  showItem,
  showNews,
  userBalanceHistoryApi
} from '@/services/adminApi';

const adminStore = createSlice({
  name: ADMIN_STORE,
  initialState: DEFAULT_ADMIN_STATE,
  reducers: {
    clear: () => {
      return DEFAULT_ADMIN_STATE;
    },
    resetDataReport: (state: any) => {
      state.listHistory = [];
    }
  },
  extraReducers(builder) {
    builder
      .addCase(adminLoginAction.pending, (state: any, _action) => {
        state.loading = true;
      })
      .addCase(adminLoginAction.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.loading = false;
      })
      .addCase(adminLoginAction.rejected, (state, _action) => {
        state.loading = false;
      })
      .addCase(getListNewsConfigAction.fulfilled, (state: any, action) => {
        state.listNewsFull = action.payload || [];
      })
      .addCase(getListProductConfigAction.fulfilled, (state: any, action) => {
        state.listProductFull = action.payload || [];
      })
      .addCase(getListItemBonusConfigAction.fulfilled, (state: any, action) => {
        state.listProductBonusFull = action.payload || [];
      })
      .addCase(getDashBoardAction.pending, (state: any, _action) => {
        state.loading = true;
      })
      .addCase(getDashBoardAction.fulfilled, (state: any, action) => {
        state.dashboard = action.payload;
        state.loading = false;
      })
      .addCase(getDashBoardAction.rejected, (state, _action) => {
        state.loading = false;
      })
      .addCase(getListGiftCodeAction.pending, (state: any, _action) => {
        state.loading = true;
      })
      .addCase(getListGiftCodeAction.fulfilled, (state: any, action) => {
        state.listGift = (action.payload as any) || [];
        state.loading = false;
      })
      .addCase(getListGiftCodeAction.rejected, (state, _action) => {
        state.loading = false;
      })
      .addCase(getAllPromotionAction.fulfilled, (state: any, action) => {
        state.listPromotion = (action.payload as any) || [];
        state.loading = false;
      })
      .addCase(getUserBalanceHistoryAction.pending, (state: any, _action) => {
        state.loading = true;
      })
      .addCase(getUserBalanceHistoryAction.fulfilled, (state: any, action) => {
        state.listHistory = action.payload;
        state.loading = false;
      })
      .addCase(getUserBalanceHistoryAction.rejected, (state, _action) => {
        state.loading = false;
      })
      .addCase(getAllEventRewardsAction.fulfilled, (state: any, action) => {
        state.listEventRewards = (action.payload as any) || [];
        state.loading = false;
      })
      .addCase(getAllItemEventRewardsAction.fulfilled, (state: any, action) => {
        state.listItemEventRewards = (action.payload as any) || [];
        state.loading = false;
      })
      .addCase(dashBoardCronAction.pending, (state: any, _action) => {
        state.loading = true;
      })
      .addCase(dashBoardCronAction.fulfilled, (state: any, _action) => {
        state.loading = false;
      })
      .addCase(dashBoardCronAction.rejected, (state, _action) => {
        state.loading = false;
      });
  }
});

// redux thunk

export const adminLoginAction = createAsyncThunk(
  `${ADMIN_STORE}/login`,
  async (
    {
      username,
      password
    }: {
      username: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    const authenRes = await adminLogin(username, password);
    const checkErrCode = get(authenRes, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return rejectWithValue(authenRes);
    }
    return authenRes?.data;
  }
);

export const addNewsAction = createAsyncThunk(`${ADMIN_STORE}/add-news`, async (payload: any) => {
  return adminCreateNews(payload);
});

export const addConfigLinkGameAction = createAsyncThunk(
  `${ADMIN_STORE}/add-config-link-game`,
  async (payload: any) => {
    return addConfigLinkGame(payload);
  }
);
export const addConfigPromotionAction = createAsyncThunk(
  `${ADMIN_STORE}/add-config-promotion-game`,
  async (payload: any) => {
    return addConfigPromotion(payload);
  }
);

export const getListNewsConfigAction = createAsyncThunk(
  `${ADMIN_STORE}/list-news-all`,
  async () => {
    const newRes = await getListNewsAll();
    const checkErrCode = get(newRes, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return newRes;
    }
    return newRes.data;
  }
);
export const getListProductConfigAction = createAsyncThunk(
  `${ADMIN_STORE}/list-product-all`,
  async () => {
    const newRes = await getListProductAll();
    const checkErrCode = get(newRes, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return newRes;
    }
    return newRes.data;
  }
);

export const getListItemBonusConfigAction = createAsyncThunk(
  `${ADMIN_STORE}/list-item-bonus-all`,
  async () => {
    const newRes = await getListItemBonusAll();
    const checkErrCode = get(newRes, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return newRes;
    }
    return newRes.data;
  }
);

export const hideNewsAction = createAsyncThunk(`${ADMIN_STORE}/hide-news`, async (id: string) => {
  return hideNews(id);
});
export const showNewsAction = createAsyncThunk(`${ADMIN_STORE}/show-news`, async (id: string) => {
  return showNews(id);
});

export const deleteNewsAction = createAsyncThunk(
  `${ADMIN_STORE}/delete-news`,
  async (id: string) => {
    return deleteNews(id);
  }
);

export const hideItemAction = createAsyncThunk(`${ADMIN_STORE}/hide-item`, async (id: string) => {
  return hideItem(id);
});
export const showItemAction = createAsyncThunk(`${ADMIN_STORE}/show-item`, async (id: string) => {
  return showItem(id);
});

export const deleteItemAction = createAsyncThunk(
  `${ADMIN_STORE}/delete-item`,
  async (id: string) => {
    return deleteItem(id);
  }
);

export const deleteItemBonusAction = createAsyncThunk(
  `${ADMIN_STORE}/delete-item-bonus`,
  async (id: string) => {
    return deleteItemBonus(id);
  }
);

export const addItemAction = createAsyncThunk(`${ADMIN_STORE}/add-item`, async (payload: any) => {
  return adminCreateItem(payload);
});
export const addItemBonusAction = createAsyncThunk(
  `${ADMIN_STORE}/add-item-bonus`,
  async (payload: any) => {
    return adminCreateBonusItem(payload);
  }
);

export const getDashBoardAction = createAsyncThunk(`${ADMIN_STORE}/dashboard`, async () => {
  const newRes = await getDashBoard();
  const checkErrCode = get(newRes, 'status');
  if (checkErrCode && checkErrCode !== 200) {
    return newRes;
  }
  return newRes.data;
});

export const getListGiftCodeAction = createAsyncThunk(`${ADMIN_STORE}/list-gift-all`, async () => {
  const newRes = await getListGiftCodeAll();
  const checkErrCode = get(newRes, 'status');
  if (checkErrCode && checkErrCode !== 200) {
    return newRes;
  }
  return newRes.data || [];
});

export const inActiveGiftAction = createAsyncThunk(
  `${ADMIN_STORE}/hide-gift-code`,
  async (id: string) => {
    return inActiveGift(id);
  }
);
export const activeGiftAction = createAsyncThunk(
  `${ADMIN_STORE}/show-gift-code`,
  async (id: string) => {
    return activeGift(id);
  }
);

export const deleteGiftAction = createAsyncThunk(
  `${ADMIN_STORE}/delete-gift-code`,
  async (id: string) => {
    return deleteGift(id);
  }
);

export const createGiftCodeAction = createAsyncThunk(
  `${ADMIN_STORE}/create-gift-code`,
  async (payload: any) => {
    return adminCreateGiftCode(payload);
  }
);

export const getAllPromotionAction = createAsyncThunk(
  `${ADMIN_STORE}/get-all-promotion`,
  async () => {
    const data = await getAllPromotion();
    const checkErrCode = get(data, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return data;
    }
    return data.data;
  }
);

export const addMoneyAction = createAsyncThunk(
  `${ADMIN_STORE}/add-money-action`,
  async (payload: any) => {
    return addMoneyByUserName(payload);
  }
);

export const addBonusMoneyAction = createAsyncThunk(
  `${ADMIN_STORE}/add-bonus-money-action`,
  async (payload: any) => {
    return addBonusMoneyByUserName(payload);
  }
);

export const getUserBalanceHistoryAction = createAsyncThunk(
  `${ADMIN_STORE}/get-user-balance-history`,
  async (type: string) => {
    const hRes = await userBalanceHistoryApi(type);
    const checkErrCode = get(hRes, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return hRes;
    }
    return hRes.data;
  }
);

export const addGuideBookAction = createAsyncThunk(
  `${ADMIN_STORE}/add-guidebook`,
  async (payload: any) => {
    return adminCreateGuidebook(payload);
  }
);

export const deleteGuideBookAction = createAsyncThunk(
  `${ADMIN_STORE}/delete-guidebook`,
  async (id: string) => {
    return deleteGuideBook(id);
  }
);

export const addEventRewardsAction = createAsyncThunk(
  `${ADMIN_STORE}/add-event-rewards`,
  async (payload: any) => {
    return apiAdminAddEventRewards(payload);
  }
);

export const getAllEventRewardsAction = createAsyncThunk(
  `${ADMIN_STORE}/get-all-event-rewards`,
  async () => {
    const data = await apiGetAllEventRewards();
    const checkErrCode = get(data, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return data;
    }
    return data.data;
  }
);

export const deleteEventRewardsAction = createAsyncThunk(
  `${ADMIN_STORE}/delete-event-rewards`,
  async (id: string) => {
    return apiDeleteEventRewardsById(id);
  }
);

export const addItemEventRewardsAction = createAsyncThunk(
  `${ADMIN_STORE}/add-item-event-rewards`,
  async (payload: any) => {
    return apiAdminAddItemEventRewards(payload);
  }
);

export const getAllItemEventRewardsAction = createAsyncThunk(
  `${ADMIN_STORE}/get-all-item-event-rewards`,
  async () => {
    const data = await apiGetAllItemEventRewards();
    const checkErrCode = get(data, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return data;
    }
    return data.data;
  }
);

export const deleteItemEventRewardsAction = createAsyncThunk(
  `${ADMIN_STORE}/delete-item-event-rewards`,
  async (id: string) => {
    return apiDeleteItemEventRewardsById(id);
  }
);

export const dashBoardCronAction = createAsyncThunk(`${ADMIN_STORE}/cron-dashboard`, async () => {
  const newRes = await cronInDashBoard();
  return newRes;
});

const adminActions = adminStore.actions;
const adminReducer = adminStore.reducer;

export { adminActions, adminReducer };
