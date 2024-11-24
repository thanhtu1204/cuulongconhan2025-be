import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface BonusUser extends Document {
  user_id: number;
  user_name: string;
  email: string;
  telephone?: string;
  address?: string;
  level?: number;
  totalpost?: number;
  balance?: number;
  isActivate?: boolean;
  ActivateCode?: string;
  created_at?: Date;
  created_by?: string;
  delete_flag?: boolean;
  status?: boolean;
  message?: string;
  fullname?: string;
}

const bonusUserSchema = new Schema<BonusUser>({
  user_id: { type: Number, required: true, unique: true },
  user_name: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: String, default: '' }, // Giá trị mặc định là chuỗi rỗng
  address: { type: String, default: '' }, // Giá trị mặc định là chuỗi rỗng
  level: { type: Number, default: 0 }, // Giá trị mặc định là 0
  totalpost: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  isActivate: { type: Boolean, default: false },
  ActivateCode: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }, // Mặc định là thời gian hiện tại
  created_by: { type: String, default: '' },
  delete_flag: { type: Boolean, default: false },
  status: { type: Boolean, default: false },
  message: { type: String, default: '' },
  fullname: { type: String, default: '' }
});

bonusUserSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const BonusUserModel =
  mongoose.models.BonusUser || mongoose.model<BonusUser>('BonusUser', bonusUserSchema);

export default BonusUserModel;
