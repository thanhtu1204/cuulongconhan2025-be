import type { PurchaseHistory } from '@/libs/mongo/model/PurchaseHistoryModel';
import PurchaseHistoryModel from '@/libs/mongo/model/PurchaseHistoryModel';
import { connectToDatabaseOnce } from '@/libs/mongooDb';

export async function savePurchaseHistory(data: Partial<PurchaseHistory>) {
  try {
    await connectToDatabaseOnce();

    const newPurchase = new PurchaseHistoryModel(data);
    await newPurchase.save();
    return { success: true, purchase: newPurchase };
  } catch (error) {
    console.error('Error saving purchase history:', error);
    return { success: false, message: 'Error occurred', error: error.message };
  }
}

export async function getPurchaseHistoryByUserId(user_id: number) {
  try {
    await connectToDatabaseOnce();
    const history = await PurchaseHistoryModel.find({ user_id }).sort({ purchase_date: -1 }).lean();
    return { success: true, history };
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    return { success: false, message: 'Error occurred', error: error.message };
  }
}

export async function getPurchaseById(id: string) {
  try {
    await connectToDatabaseOnce();
    const purchase = await PurchaseHistoryModel.findById(id).lean();
    if (!purchase) {
      return { success: false, message: 'Purchase not found' };
    }
    return { success: true, purchase };
  } catch (error) {
    console.error('Error fetching purchase by ID:', error);
    return { success: false, message: 'Error occurred', error: error.message };
  }
}
