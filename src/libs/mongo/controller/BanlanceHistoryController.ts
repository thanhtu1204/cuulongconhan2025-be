import BalanceHistoryModel from '@/libs/mongo/model/BalanceHistoryModel';
import { connectToDatabaseOnce } from '@/libs/mongooDb';

export async function getBalanceHistoryByUserId(userName: string) {
  try {
    await connectToDatabaseOnce();

    // Lấy lịch sử giao dịch của user
    const history = await BalanceHistoryModel.find({ user_name: userName })
      .sort({ created_at: -1 })
      .lean();

    if (!history.length) {
      return { success: false, message: 'No transaction history found' };
    }

    return { success: true, history };
  } catch (error) {
    console.error('Error fetching balance history:', error);
    return { success: false, message: 'Error fetching balance history', error: error.message };
  }
}

export async function getAllBalanceHistories() {
  try {
    await connectToDatabaseOnce();

    // Lấy tất cả lịch sử giao dịch, sắp xếp từ mới đến cũ
    const history = await BalanceHistoryModel.find({}).sort({ created_at: -1 }).lean();

    if (!history.length) {
      return { success: false, message: 'No transaction history found' };
    }

    return { success: true, history };
  } catch (error) {
    console.error('Error fetching all balance histories:', error);
    return {
      success: false,
      message: 'Error fetching all balance histories',
      error: error.message
    };
  }
}
