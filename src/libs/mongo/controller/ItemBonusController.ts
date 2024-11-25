import DbCis from '@/libs/dbCis';
import { savePurchaseHistory } from '@/libs/mongo/controller/PurchaseHistoryController';
import BonusUserModel from '@/libs/mongo/model/BonusUserModel';
import type { ItemBonus } from '@/libs/mongo/model/ItemBonusModel';
import ItemBonusModel from '@/libs/mongo/model/ItemBonusModel';
import { connectToDatabaseOnce } from '@/libs/mongooDb';

export async function createBonusItem(itemData: Partial<ItemBonus>) {
  try {
    await connectToDatabaseOnce();
    const newItem = new ItemBonusModel(itemData);
    await newItem.save();
    return { success: true, item: newItem };
  } catch (error) {
    console.error('Error creating bonus item:', error);
    return { success: false, message: 'Error occurred', error: error.message };
  }
}

export async function getAllBonusItems() {
  try {
    await connectToDatabaseOnce();
    return await ItemBonusModel.find().sort({ item_name: 1 }).lean();
  } catch (error) {
    console.error('Error fetching bonus items:', error);
    return { success: false, message: 'Error fetching bonus items', error: error.message };
  }
}

export async function getBonusItemById(id: string) {
  try {
    await connectToDatabaseOnce();
    const item = await ItemBonusModel.findById(id).lean();
    if (!item) {
      return { success: false, message: 'Bonus item not found' };
    }
    return { success: true, item };
  } catch (error) {
    console.error('Error fetching bonus item by ID:', error);
    return { success: false, message: 'Error occurred', error: error.message };
  }
}

export async function updateBonusItem(id: string, updateData: Partial<ItemBonus>) {
  try {
    await connectToDatabaseOnce();
    const updatedItem = await ItemBonusModel.findByIdAndUpdate(id, updateData, {
      new: true
    }).lean();
    if (!updatedItem) {
      return { success: false, message: 'Bonus item not found' };
    }
    return { success: true, item: updatedItem };
  } catch (error) {
    console.error('Error updating bonus item:', error);
    return { success: false, message: 'Error occurred', error: error.message };
  }
}

export async function deleteBonusItem(id: string) {
  try {
    await connectToDatabaseOnce();
    const deletedItem = await ItemBonusModel.findByIdAndDelete(id).lean();
    if (!deletedItem) {
      return { success: false, message: 'Bonus item not found' };
    }
    return { success: true, message: 'Bonus item deleted successfully' };
  } catch (error) {
    console.error('Error deleting bonus item:', error);
    return { success: false, message: 'Error occurred', error: error.message };
  }
}

export async function updateBonusItemStatus(id: string, status: number) {
  try {
    await connectToDatabaseOnce();
    const updatedItem = await ItemBonusModel.findByIdAndUpdate(
      id,
      { item_status: status },
      { new: true }
    ).lean();
    if (!updatedItem) {
      return { success: false, message: 'Bonus item not found' };
    }
    return { success: true, item: updatedItem };
  } catch (error) {
    console.error('Error updating bonus item status:', error);
    return { success: false, message: 'Error occurred', error: error.message };
  }
}

export async function getAllBonusItemsSell() {
  try {
    await connectToDatabaseOnce();
    return await ItemBonusModel.find({ item_status: 2 })
      .sort({ item_name: 1 }) // Sắp xếp theo tên
      .lean();
  } catch (error) {
    console.error('Error fetching bonus items with status 2:', error);
    return { success: false, message: 'Error fetching bonus items', error: error.message };
  }
}

export async function purchaseItem(userName: string, itemId: string, quantity: number) {
  try {
    // Kết nối database nếu cần
    await connectToDatabaseOnce();

    const user: any = await BonusUserModel.findOne({ user_name: userName }).lean();
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const item = await ItemBonusModel.findById(itemId).lean();
    if (!item) {
      return { success: false, message: 'Item not found' };
    }

    const totalCost = item.item_price * quantity;

    if (Number(user.balance) < Number(totalCost)) {
      return { success: false, message: 'Insufficient balance' };
    }

    // Trừ tiền từ tài khoản
    const newBalance = user.balance - totalCost;
    await BonusUserModel.updateOne({ user_name: userName }, { $set: { balance: newBalance } });
    // add vào đã
    const itemAdd = {
      user_id: user.user_name,
      cart_itemCode: item.item_code,
      game_server: 0,
      item_price: item.item_price
    };
    await DbCis.executeBonusStoredProcedure(itemAdd);
    const historyData = {
      user_id: user.user_id,
      user_name: userName,
      item_id: item._id,
      item_name: item.item_name,
      item_price: item.item_price,
      quantity,
      total_price: item.item_price,
      purchase_date: new Date(),
      status: 'completed'
    };
    await savePurchaseHistory(historyData);
    return {
      success: true,
      message: 'Purchase successful',
      balance: newBalance
    };
  } catch (error) {
    console.error('Error during purchase:', error);
    return { success: false, message: 'Error during purchase', error: error.message };
  }
}
