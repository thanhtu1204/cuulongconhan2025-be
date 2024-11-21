import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { get } from 'lodash';

import { DEFAULT_HOME_STATE, HOME_STORE } from '@/constants/home';
import { getGuideBook, getLinkGame, getListNews } from '@/services/homeApi';

const homeStore = createSlice({
  name: HOME_STORE,
  initialState: DEFAULT_HOME_STATE,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getNewsAction.fulfilled, (state: any, action) => {
      state.news = action.payload;
    });
    builder
      .addCase(getLinkGameAction.fulfilled, (state: any, action) => {
        state.linkDownLoad = action.payload;
      })
      .addCase(getGuidBookByIdAction.pending, (state: any, _action) => {
        state.loading = true;
      })
      .addCase(getGuidBookByIdAction.fulfilled, (state, action) => {
        state.guideData = action.payload;
        state.loading = false;
      })
      .addCase(getGuidBookByIdAction.rejected, (state, _action) => {
        state.loading = false;
      });
  }
});

// redux thunk
export const getNewsAction = createAsyncThunk(`${HOME_STORE}/getNews`, async () => {
  const newRes = await getListNews();
  const checkErrCode = get(newRes, 'status');
  if (checkErrCode && checkErrCode !== 200) {
    return newRes;
  }
  return newRes.data;
});

export const getLinkGameAction = createAsyncThunk(`${HOME_STORE}/getLinkGame`, async () => {
  const data = await getLinkGame();
  const checkErrCode = get(data, 'status');
  if (checkErrCode && checkErrCode !== 200) {
    return data;
  }
  return data.data;
});

export const getGuidBookByIdAction = createAsyncThunk(
  `${HOME_STORE}/get-guidbook-by-id`,
  async (
    {
      id
    }: {
      id: string;
    },
    { rejectWithValue }
  ) => {
    const data = await getGuideBook(id);
    const checkErrCode = get(data, 'status');
    if (checkErrCode && checkErrCode !== 200) {
      return rejectWithValue(data);
    }
    return data.data;
  }
);

const homeActions = homeStore.actions;
const homeReducer = homeStore.reducer;

export { homeActions, homeReducer };
