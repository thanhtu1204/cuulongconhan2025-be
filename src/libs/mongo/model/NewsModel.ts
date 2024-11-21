import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

// Định nghĩa interface cho News
export interface INewsModel extends Document {
  title: {
    en: string;
    vi: string;
  };
  ascii: string;
  images: string[];
  type: number;
  descriptions: {
    en: string;
    vi: string;
  };
  content: {
    en: string;
    vi: string;
  };
  created_by: string;
  delete_flag: boolean;
}

// Định nghĩa schema cho News
const NewsSchema: Schema = new Schema<INewsModel>(
  {
    title: {
      en: { type: String, required: true },
      vi: { type: String, required: true }
    },
    ascii: { type: String, required: true },
    images: [String],
    type: { type: Number, required: true },
    descriptions: {
      en: { type: String, required: true },
      vi: { type: String, required: true }
    },
    content: {
      en: { type: String, required: true },
      vi: { type: String, required: true }
    },
    created_by: { type: String, required: true },
    delete_flag: { type: Boolean, default: false }
  },
  { timestamps: true } // Tự động thêm `createdAt` và `updatedAt`
);

// Tạo model từ schema
const NewsModel = mongoose.models.News || mongoose.model<INewsModel>('News', NewsSchema);

export default NewsModel;
