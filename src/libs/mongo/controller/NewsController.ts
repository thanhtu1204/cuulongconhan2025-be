/**
 * Tạo hoặc cập nhật tin tức
 */
import type { INewsModel } from '@/libs/mongo/model/NewsModel';
import NewsModel from '@/libs/mongo/model/NewsModel';
import { connectToDatabaseOnce } from '@/libs/mongooDb';

export const createNews = async (data: Partial<INewsModel>) => {
  try {
    await connectToDatabaseOnce();
    const news = new NewsModel(data);
    const result = await news.save();
    return result;
  } catch (error) {
    throw new Error(`Error creating news: ${error.message}`);
  }
};

export const updateNews = async (id: string, data: Partial<INewsModel>) => {
  try {
    await connectToDatabaseOnce();
    const result = await NewsModel.findByIdAndUpdate(id, data, { new: true });
    if (!result) {
      throw new Error('News not found');
    }
    return result;
  } catch (error) {
    throw new Error(`Error updating news: ${error.message}`);
  }
};

export const deleteNews = async (id: string) => {
  try {
    // Kết nối tới MongoDB
    await connectToDatabaseOnce();

    // Tìm và cập nhật `delete_flag`
    const result = await NewsModel.findByIdAndUpdate(
      id,
      { delete_flag: true }, // Cập nhật trường delete_flag
      { new: true } // Trả về document sau khi cập nhật
    );

    if (!result) {
      throw new Error('News not found');
    }

    return result;
  } catch (error) {
    throw new Error(`Error updating delete_flag for news: ${error.message}`);
  }
};

export const getAllNews = async () => {
  try {
    await connectToDatabaseOnce();
    const newsList = await NewsModel.find();
    return newsList;
  } catch (error) {
    throw new Error(`Error fetching news: ${error.message}`);
  }
};

export const getAllNewsByLanguage = async () => {
  try {
    await connectToDatabaseOnce();
    const newsList = await NewsModel.find({ delete_flag: false }).lean();
    return newsList;
  } catch (error) {
    throw new Error(`Error fetching news }: ${error.message}`);
  }
};

export const getNewsById = async (id: string) => {
  try {
    await connectToDatabaseOnce();
    const news = await NewsModel.findOne({ _id: id, delete_flag: false }).lean();
    if (!news) {
      throw new Error('News not found or has been deleted');
    }
    return news;
  } catch (error) {
    throw new Error(`Error fetching news with ID ${id} : ${error.message}`);
  }
};
