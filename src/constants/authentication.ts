export const DEFAULT_AUTHEN_STATE = {
  accessToken: '',
  loading: false,
  products: [],
  user: {
    id: 0,
    user_name: '',
    displayName: '',
    balance: 0,
    isActivate: false,
    roles: ''
  },
  userInfo: {
    user_id: 0,
    user_name: '',
    email: '',
    telephone: '',
    address: '',
    balance: 0,
    isActive: false,
    created_at: '',
    fullname: '',
    characters: []
  },
  qrCode: { qrCode: '', qrDataURL: '' },
  transactions: [],
  userDataRewards: [],
  balanceUserRewards: {
    order_user_id: '',
    total_spent: 0
  },
  eventActiveRewards: {
    event_id: 0,
    event_name: '',
    start_time: '',
    end_time: '',
    background_image: '',
    type_event: 0
  }
};

export const AUTHEN_STORE = 'authen';
