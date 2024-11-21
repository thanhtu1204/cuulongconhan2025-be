import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import type { AdminState } from '@/constants/admin';
import { ADMIN_STORE } from '@/constants/admin';
import { AUTHEN_STORE } from '@/constants/authentication';
import { HOME_STORE } from '@/constants/home';
import { adminReducer } from '@/stores/admin';
import { authenReducer } from '@/stores/authentication';
import { homeReducer } from '@/stores/home';
import type { AuthenState } from '@/types/authTypes';
import type { HomeState } from '@/types/homeTypes';
import type { LoadingState } from '@/types/loading';

import { LOADING_STORE, loadingReducer } from './loading';

export type RootState = {
  [AUTHEN_STORE]: AuthenState;
  [LOADING_STORE]: LoadingState;
  [HOME_STORE]: HomeState;
  [ADMIN_STORE]: AdminState;
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [AUTHEN_STORE, ADMIN_STORE]
};

const rootReducer = combineReducers({
  [LOADING_STORE]: loadingReducer,
  [AUTHEN_STORE]: authenReducer,
  [HOME_STORE]: homeReducer,
  [ADMIN_STORE]: adminReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

type AppDispatch = typeof store.dispatch;
const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const persistor = persistStore(store);

export { persistor, store, useAppDispatch, useAppSelector };
