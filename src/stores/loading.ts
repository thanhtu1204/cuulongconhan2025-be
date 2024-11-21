import { createSlice } from '@reduxjs/toolkit';

import type { LoadingState } from '@/types/loading';

const DEFAULT_LOADING_STATE: LoadingState = {
  loadingCount: false
};

export const LOADING_STORE = 'loading';

const loadingStore = createSlice({
  name: LOADING_STORE,
  initialState: DEFAULT_LOADING_STATE,
  reducers: {
    showLoading: (state) => {
      state.loadingCount = true;
    },
    hideLoading: (state) => {
      state.loadingCount = false;
    }
  }
});

const loadingActions = loadingStore.actions;
const loadingReducer = loadingStore.reducer;

export { loadingActions, loadingReducer };
