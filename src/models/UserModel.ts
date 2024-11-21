export interface UserModel {
  user_id: number;
  user_name: string;
  password: string;
  email: string;
  telephone: string;
  address: string;
  level: null;
  totalpost: null;
  balance: number;
  isActivate: boolean;
  ActivateCode: string;
  created_at: Date;
  created_by: string;
  delete_flag: boolean;
  status: null;
  message: null;
  fullname: string;
}
