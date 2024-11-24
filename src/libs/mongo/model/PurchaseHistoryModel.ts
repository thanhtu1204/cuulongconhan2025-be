import type { Document, Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface PurchaseHistory extends Document {
  user_id: number; // ID người dùng thực hiện giao dịch
  item_id: string; // ID sản phẩm
  item_name: string; // Tên sản phẩm
  item_price: number; // Giá sản phẩm tại thời điểm mua
  quantity: number; // Số lượng sản phẩm mua
  total_price: number; // Tổng giá (số lượng * giá sản phẩm)
  purchase_date: Date; // Ngày giờ giao dịch
  status: string; // Trạng thái giao dịch (e.g., "completed", "pending", "failed")
}

const purchaseHistorySchema = new Schema<PurchaseHistory>({
  user_id: { type: Number, required: true },
  item_id: { type: String, required: true },
  item_name: { type: String, required: true },
  item_price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total_price: { type: Number, required: true },
  purchase_date: { type: Date, default: Date.now },
  status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' }
});

const PurchaseHistoryModel: Model<PurchaseHistory> =
  mongoose.models.PurchaseHistory ||
  mongoose.model<PurchaseHistory>('PurchaseHistory', purchaseHistorySchema);

export default PurchaseHistoryModel;
