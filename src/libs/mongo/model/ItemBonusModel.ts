import type { Document, Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface ItemBonus extends Document {
  item_category: number;
  item_code: number;
  item_price: number;
  item_day: number;
  item_quantity: number;
  item_status: number;
  item_name: string;
  item_description: string;
  item_image: string;
  key_word: string;
  is_present: number;
  item_description_en: string;
  item_name_en: string;
}

const itemBonusSchema = new Schema<ItemBonus>({
  item_category: { type: Number, required: true },
  item_code: { type: Number, required: true },
  item_price: { type: Number, required: true },
  item_day: { type: Number, required: true },
  item_quantity: { type: Number, required: true },
  item_status: { type: Number, required: true },
  item_name: { type: String, required: true },
  item_description: { type: String, default: '' },
  item_image: { type: String, default: '' },
  key_word: { type: String, default: '' },
  is_present: { type: Number, default: 0 },
  item_description_en: { type: String, default: '' },
  item_name_en: { type: String, default: '' }
});

const ItemBonusModel: Model<ItemBonus> =
  mongoose.models.ItemBonus || mongoose.model<ItemBonus>('ItemBonus', itemBonusSchema);

export default ItemBonusModel;
