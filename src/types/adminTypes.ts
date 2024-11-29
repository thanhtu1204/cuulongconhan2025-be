export interface IAllTrans {
  transaction_id: number;
  discount_percentage?: number;
  user_id: number;
  transaction_bank_id: string;
  transaction_time: string;
  transaction_description: string;
  transaction_code: string;
  amount: number;
  status: string;
  create_at: Date;
  create_at_timestamp?: string;
  transaction_time_timestamp?: string;
}

export interface ITrans {
  row_count: number;
  amount_total: number;
}

export interface IDashBoard {
  user_count: number;
  trans: ITrans;
  allTrans: IAllTrans[];
  dataBonus: any[];
}

export interface IGiftList {
  listGift: IGift[];
}

export interface IGift {
  item_id: number;
  gift_code: string;
  item_code: string;
  group_user?: null | string;
  active_id?: number;
  active_user?: null;
  delete_flag?: boolean;
  gift_count?: number;
  create_at?: string;
  expried_date?: string;
  update_at?: string;
}

export interface PromotionConfig {
  id?: number;
  minAmount?: number;
  maxAmount?: number;
  discountPercentage?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface IGuideWeb {
  id?: number;
  title: string;
  content: string;
  delete_flag?: boolean;
  create_at?: string;
  update_at?: string;
  type_guide?: string;
}

export interface IHistory {
  history_id: number;
  user_id: number;
  user_name: string;
  email: string;
  telephone: string;
  fullname: string;
  old_balance: number;
  new_balance: number;
  transaction_type: string;
  change_time: string;
  change_time_timestamp?: string;
  order_idx?: number;
  order_user_id?: string;
  order_item_code?: number;
  order_input_date?: string;
  order_input_date_timestamp?: string;
  item_name?: string;
  item_price?: number;
}

export interface EventRewards {
  event_name: string;
  start_time: string;
  end_time: string;
  background_image: string;
  type_event: number;
  event_id?: number;
}

export interface IItemEventRewards {
  event_id: number;
  reward_name: string;
  reward_image: string;
  required_points: number;
  reward_item_code: number;

  reward_description: string;
  reward_id?: string;
}
