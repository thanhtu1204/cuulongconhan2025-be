export interface IUser {
  username: string;
  password: string;
  email: string;
  telephone: string;
  address: string;
  balance?: number;
  isActivate?: boolean;
  created_at?: Date;
  createdby?: string;
  fullname: string;
}

export interface IChangPassUser {
  password: string;
  oldPassword: string;
}

export interface IAllUser {
  user_name: string;
  user_id: number;
}
