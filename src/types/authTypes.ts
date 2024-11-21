export type AuthenState = {
  accessToken: string;
  loading: boolean;
  user: {
    id?: number;
    user_name: string;
    displayName: string;
    fullName: string;
    balance: number;
    isActivate: boolean;
    roles: string;
  };
  userInfo: UserInfo;
  products: IProduct[];
  qrCode: DataQr;
  transactions: ITransaction[];
  userDataRewards: any[];
  balanceUserRewards: IBalanceUser;
  eventActiveRewards: IEventReward;
};

export interface IBalanceUser {
  order_user_id?: string;
  total_spent?: number;
}

export interface IEventReward {
  event_id?: number;
  event_name?: string;
  start_time?: string;
  end_time?: string;
  background_image?: string;
  type_event?: number;
}

export type CurrentUser = {
  username?: string;
  roles?: string[];
  permissions?: string[];
};

// export interface IProduct {
//   id: number;
//   itemId: string;
//   itemname: string;
//   itemimages: string;
//   itemprice: number;
//   quality?: number;
//   itemdescription: string;
//   created_at?: string;
//   created_by?: string;
//   updated_at?: string;
//   updated_by?: string;
//   delete_flag?: boolean;
// }

export interface IProduct {
  seq: number;
  item_category: string;
  item_code: string;
  item_price: number;
  item_day: string;
  item_quantity: number;
  item_status: string;
  item_name: string;
  item_description: string;
  item_image: string;
  key_word: string;
  is_present: boolean;
}

export interface IProductList {
  products: IProduct[];
}

export interface IBuyProduct {
  user: {
    _id: number;
    user_name: string;
    displayName: string;
    fullName: string;
    balance: number;
    isActivate: boolean;
    roles: string;
  };
}

export interface IGenQR {
  code: string;
  desc: string;
  data: DataQr;
}

export interface DataQr {
  qrCode: string;
  qrDataURL: string;
}

export interface ITransaction {
  status: number;
  success: boolean;
  message: string;
  data: Transaction[];
}

export interface Transaction {
  transaction_id: number;
  user_id: number;
  transaction_bank_id: string;
  transaction_time: string;
  transaction_description: string;
  transaction_code: string;
  amount: number;
  status: string;
  create_at: Date;
  // RowNum: string;
  // IDGame: string;
  // item_code: number;
  // item_name: 'string';
  // item_price: number;
  // order_game_server: string;
  // order_input_date: Date;
  // Type: string;
}

export interface IUserInfo {
  status: number;
  success: boolean;
  message: string;
  data: UserInfo;
}

export interface UserInfo {
  user_id?: number;
  user_name?: string;
  email?: string;
  telephone?: string;
  address?: string;
  balance?: number;
  isActive?: boolean;
  created_at?: Date;
  fullname?: string;
  roles?: string;
  characters?: any;
}
