// Hàm cập nhật hoặc thêm mới
import BalanceHistoryModel from '@/libs/mongo/model/BalanceHistoryModel';
import BonusUserModel from '@/libs/mongo/model/BonusUserModel';
import { connectToDatabaseOnce } from '@/libs/mongooDb';

export async function syncAndUpdateBalance(sqlUser: any, additionalBalance: number) {
  try {
    // Kết nối MongoDB
    await connectToDatabaseOnce();
    // Tìm kiếm user trong MongoDB
    const existingUser: any = await BonusUserModel.findOne({
      user_id: sqlUser?.user_id ?? ''
    }).lean();
    if (existingUser) {
      // User tồn tại, cập nhật balance
      existingUser.balance += additionalBalance;
      await existingUser.save();
      await BalanceHistoryModel.create({
        user_id: sqlUser.user_id,
        user_name: sqlUser.user_name,
        amount: additionalBalance,
        action: 'add',
        note: 'Balance updated'
      });
      return { success: true, message: 'Balance updated', user: existingUser };
    }
    // Thêm mới vào MongoDB
    const newUser = new BonusUserModel({
      user_id: sqlUser.user_id,
      user_name: sqlUser.user_name,
      email: sqlUser.email,
      telephone: sqlUser.telephone || '',
      address: sqlUser.address || '',
      level: sqlUser.level || 0,
      totalpost: sqlUser.totalpost || 0,
      balance: additionalBalance,
      isActivate: sqlUser.isActivate || false,
      ActivateCode: sqlUser.ActivateCode || '',
      created_at: sqlUser.created_at || new Date(),
      created_by: sqlUser.created_by || '',
      delete_flag: sqlUser.delete_flag || false,
      status: sqlUser.status || false,
      message: sqlUser.message || '',
      fullname: sqlUser.fullname || ''
    });
    await newUser.save();
    await BalanceHistoryModel.create({
      user_id: sqlUser.user_id,
      user_name: sqlUser.user_name,

      amount: additionalBalance,
      action: 'add',
      note: 'Initial balance added'
    });
    return { success: true, message: 'User added to MongoDB', user: newUser };
  } catch (error) {
    return { success: false, message: 'Error occurred', error: error.message };
  }
}

export async function findBonusUserByUserName(userName: string) {
  try {
    await connectToDatabaseOnce();
    const user = await BonusUserModel.findOne({ user_name: userName }).lean();
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    return { success: true, user };
  } catch (error) {
    console.error('Error finding user by ID:', error);
    return { success: false, message: 'Error occurred', error: error.message };
  }
}

export async function findBonusUserByName(userName: string) {
  try {
    await connectToDatabaseOnce();
    const user = await BonusUserModel.findOne({ user_name: userName }).lean();
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    return { success: true, user };
  } catch (error) {
    console.error('Error finding user by name:', error);
    return { success: false, message: 'Error occurred', error: error.message };
  }
}
