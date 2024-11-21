import type {
  EventRewards,
  IDashBoard,
  IGift,
  IHistory,
  IItemEventRewards
} from '@/types/adminTypes';
import type { IProduct } from '@/types/authTypes';

export const DEFAULT_ADMIN_STATE = {
  accessToken: '',
  loading: false,
  user: {
    id: 0,
    user_name: '',
    displayName: '',
    roles: ''
  },
  listNewsFull: [],
  listProductFull: [],
  dashboard: {
    user_count: 0,
    trans: {
      row_count: 0,
      amount_total: 0
    },
    top10: []
  },
  listGift: [],
  listPromotion: {},
  listHistory: [],
  listEventRewards: [],
  listItemEventRewards: []
};

export const ADMIN_STORE = 'admin';

export type AdminState = {
  accessToken: string;
  loading: boolean;
  user: {
    id: number;
    user_name: string;
    displayName: string;
    roles: string;
  };
  listNewsFull: any[];
  listProductFull: IProduct[];
  dashboard: IDashBoard;
  listGift: IGift[];
  listPromotion: any;
  listHistory: IHistory[];
  listEventRewards: EventRewards[];
  listItemEventRewards: IItemEventRewards[];
};

export interface NewsData {
  news_id?: number;
  news_title?: string;
  news_ascii?: string;
  news_images?: string;
  type?: number;
  news_descriptions?: string;
  news_content?: string;
  created_at?: string;
  created_by?: string;
}
