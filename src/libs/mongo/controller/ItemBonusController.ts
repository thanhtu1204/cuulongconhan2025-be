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
