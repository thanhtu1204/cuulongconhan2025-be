import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { get } from 'lodash';

import { AUTHEN_STORE, DEFAULT_AUTHEN_STATE } from '@/constants/authentication';
import { HOME_STORE } from '@/constants/home';
import {
  apiGetItemRewardsById,
  buyProduct,
  exchangeGiftCode,
  getListDataRewardsAPI,
  getProducts,
  getQrCode,
  getTransaction,
  getUserInfo,
  login,
  logout,
  register,
  renameCharApi,
  userChangePassAPI
} from '@/services/authApi';
import type { IChangPassUser, IUser } from '@/types/user';

const authenStore = createSlice({
  name: AUTHEN_STORE,
  initialState: DEFAULT_AUTHEN_STATE,
  reducers: {
    logout: () => {
      return DEFAULT_AUTHEN_STATE;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loginAction.pending, (state: any, _action) => {
        state.loading = true;
      })
      .addCase(loginAction.fulfilled, (state: any, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.loading = false;
      })
      .addCase(loginAction.rejected, (state, _action) => {
        state.loading = false;
      })
      .addCase(buyProductAction.pending, (state: any, _action) => {
        state.loading = true;
      })
      .addCase(buyProductAction.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.data as any;
        }
        state.loading = false;
      })
      .addCase(buyProductAction.rejected, (state, _action) => {
        state.loading = false;
      })
      .addCase(logoutAction.pending, (state: any, _action) => {
        state.loading = true;
      })
      .addCase(logoutAction.fulfilled, (state, _action) => {
        state.user = DEFAULT_AUTHEN_STATE.user;
        state.accessToken = '';
        state.loading = false;
      })
      .addCase(logoutAction.rejected, (state, _action) => {
        state.loading = false;
      })
      .addCase(registerAction.pending, (state: any, _action) => {
        state.loading = true;
      })
      .addCase(registerAction.fulfilled, (state, _action) => {
        state.loading = false;
      })
      .addCase(registerAction.rejected, (state, _action) => {
        state.loading = false;
      })
      .addCase(getProductAction.pending, (state: any, _action) => {
        state.loading = true;
      })
      .addCase(getProductAction.fulfilled, (state, action) => {
        state.products = action.payload as any;
        state.loading = false;
      })
      .addCase(getProductAction.rejected, (state, _action) => {
        state.loading = false;
      })
      .addCase(getQrCodeAction.pending, (state: any, _action) => {
        state.loading = true;
      })
      .addCase(getQrCodeAction.fulfilled, (state, action) => {
        if (action.payload) {
          state.qrCode = action.payload.data;
        }
        state.loading = false;
      })
      .addCase(getQrCodeAction.rejected, (state, _action) => {
        state.loading = false;
      })
      .addCase(getTransactionAction.pending, (state: any, _action) => {
        state.loading = true;
      })
      .addCase(getTransactionAction.fulfilled, (state, action: any) => {
        if (action.payload) {
          state.transactions = action.payload;
        }
        state.loading = false;
      })
      .addCase(getTransactionAction.rejected, (state, _action) => {
        state.loading = false;
      })
      .addCase(getUserInfoAction.pending, (state: any, _action) => {
        state.loading = true;
      })
      .addCase(getUserInfoAction.fulfilled, (state, action: any) => {
        if (action.payload) {
          state.userInfo = action.payload;
        }
        state.loading = false;
      })
      .addCase(getUserInfoAction.rejected, (state, _action) => {
        state.loading = false;
      })
      .addCase(exchangeGiftAction.pending, (state: any, _action) => {
        state.loading = true;
      })
      .addCase(exchangeGiftAction.fulfilled, (state: any, action: any) => {
        if (action.payload) {
          state.userInfo = action.payload;
        }
        state.loading = false;
      })
      .addCase(exchangeGiftAction.rejected, (state, _action) => {
        state.loading = false;
      })
      .addCase(getListDataRewardsAction.fulfilled, (state: any, action: any) => {
        if (action.payload) {
          state.userDataRewards = action.payload.dataReward;
          state.balanceUserRewards = action.payload.balanceUser;
          state.eventActiveRewards = action.payload.eventReward;
        }
        state.loading = false;
      });
  }
});

// redux thunk

export const registerAction = createAsyncThunk(
  `${AUTHEN_STORE}/register`,
  async (payload: IUser, { rejectWithValue }) => {
    const authenRes = await register(payload);
    const checkErrCode = get(authenRes, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return rejectWithValue(authenRes);
    }

    return authenRes;
  }
);
export const loginAction = createAsyncThunk(
  `${AUTHEN_STORE}/login`,
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
    const authenRes = await login(username, password);
    const checkErrCode = get(authenRes, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return rejectWithValue(authenRes);
    }
    return authenRes.data;
  }
);

export const logoutAction = createAsyncThunk(`${AUTHEN_STORE}/logout`, async () => {
  const authenRes = await logout();
  const checkErrCode = get(authenRes, 'status');
  if (checkErrCode && checkErrCode !== 200) {
    return authenRes;
  }
  return authenRes.data;
});

export const getProductAction = createAsyncThunk(`${HOME_STORE}/getProducts`, async () => {
  const products = await getProducts();
  const checkErrCode = get(products, 'status');
  if (checkErrCode && checkErrCode !== 200) {
    return products;
  }
  return products.data;
});

export const buyProductAction = createAsyncThunk(
  `${HOME_STORE}/buyProduct`,
  async (
    {
      id
    }: {
      id: string;
    },
    { rejectWithValue }
  ) => {
    const data = await buyProduct(id);
    const checkErrCode = get(data, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return rejectWithValue(data);
    }
    return data;
  }
);

export const getQrCodeAction = createAsyncThunk(`${HOME_STORE}/getQrcode`, async () => {
  const data = await getQrCode();
  return data.data;
});
export const getTransactionAction = createAsyncThunk(`${HOME_STORE}/getTrans`, async () => {
  const data = await getTransaction();
  if (data) {
    return data.data;
  }
  return [];
});
export const getUserInfoAction = createAsyncThunk(`${HOME_STORE}/getUserInfo`, async () => {
  const data = await getUserInfo();
  if (data) {
    return data.data;
  }
  return [];
});

export const exchangeGiftAction = createAsyncThunk(
  `${HOME_STORE}/exchangeGift`,
  async (
    {
      code
    }: {
      code: string;
    },
    { rejectWithValue }
  ) => {
    const data = await exchangeGiftCode(code);
    const checkErrCode = get(data, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return rejectWithValue(data);
    }
    return data;
  }
);

export const changPassAction = createAsyncThunk(
  `${AUTHEN_STORE}/changePassByUser`,
  async (payload: IChangPassUser, { rejectWithValue }) => {
    const authenRes = await userChangePassAPI(payload);
    const checkErrCode = get(authenRes, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return rejectWithValue(authenRes);
    }
    return authenRes;
  }
);

export const getListDataRewardsAction = createAsyncThunk(
  `${HOME_STORE}/list-data-rewards`,
  async () => {
    const newRes = await getListDataRewardsAPI();
    const checkErrCode = get(newRes, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return newRes;
    }
    return newRes.data;
  }
);

export const getItemRewardsAction = createAsyncThunk(
  `${HOME_STORE}/get-item-rewards`,
  async (id: string) => {
    return apiGetItemRewardsById(id);
  }
);

export const renameCharAction = createAsyncThunk(
  `${HOME_STORE}/rename-char`,
  async (
    {
      name,
      id
    }: {
      name: string;
      id: string;
    },
    { rejectWithValue }
  ) => {
    const data = await renameCharApi({ id, name });
    const checkErrCode = get(data, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return rejectWithValue(data);
    }
    return data;
  }
);

const authenActions = authenStore.actions;
const authenReducer = authenStore.reducer;

export { authenActions, authenReducer };
