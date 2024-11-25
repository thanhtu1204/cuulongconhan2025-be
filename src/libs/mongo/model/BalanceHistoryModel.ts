import mongoose, { Schema } from 'mongoose'; // Schema lưu lịch sử giao dịch balance

// Schema lưu lịch sử giao dịch balance
const BalanceHistorySchema = new Schema({
  user_id: { type: Number, required: true }, // Liên kết tới user_id
  user_name: { type: String, required: true }, // Liên kết tới user_id
  amount: { type: Number, required: true }, // Số tiền được cộng/trừ
  action: { type: String, required: true }, // Loại hành động, ví dụ: 'add', 'subtract'
  created_at: { type: Date, default: Date.now }, // Thời gian giao dịch
  note: { type: String, required: false } // Ghi chú thêm (nếu có)
});

const BalanceHistoryModel =
  mongoose.models.BalanceHistory || mongoose.model('BalanceHistory', BalanceHistorySchema);
export default BalanceHistoryModel;
