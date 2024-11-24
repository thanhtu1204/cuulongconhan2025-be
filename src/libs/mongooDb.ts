import mongoose from 'mongoose';

import ConfigLinkDownloadModel from '@/libs/mongo/model/LinkGameModel';
import type { Guidebook } from '@/models/GuideBook';
import GuidebookModel from '@/models/GuideBook';

export async function connectToDatabaseOnce(): Promise<void> {
  try {
    if (!mongoose.connection.readyState) {
      const databaseUri =
        'mongodb+srv://cuulongconhan_admin_db:rf9suxX73yPgQapn@cluster0.uaky3gq.mongodb.net/?retryWrites=true&w=majority';
      await mongoose.connect(databaseUri);
    }
  } catch (error) {
    throw error;
  }
}

// Hàm tạo dữ liệu từ GuidebookModel
export async function createGuidebookData(
  title: string,
  titleEn: string,
  htmlContent: string,
  htmlContentEn: string,
  type: string
): Promise<Guidebook> {
  try {
    await connectToDatabaseOnce();
    const guidebook = {
      title,
      htmlContent,
      type,
      titleEn,
      htmlContentEn
    };

    const newGuidebook = await GuidebookModel.create(guidebook);
    return newGuidebook as Guidebook;
  } catch (error) {
    throw error;
  }
}

export async function getAllGuideBook() {
  try {
    await connectToDatabaseOnce();
    const guidebooks = await GuidebookModel.find({}, '_id title type').lean();
    return guidebooks.map((guidebook) => ({
      id: guidebook._id.toString(),
      title: guidebook.title,
      titleEn: guidebook.titleEn,
      type: guidebook.type
    }));
  } catch (error) {
    throw error;
  }
}

export async function deleteGuidebookById(id: string) {
  try {
    await connectToDatabaseOnce();
    const deletedGuidebook = await GuidebookModel.findByIdAndDelete(id);
    if (!deletedGuidebook) {
      return null;
    }
    return deletedGuidebook;
  } catch (error) {
    throw error;
  }
}

export async function getGuidBookById(id: string) {
  try {
    await connectToDatabaseOnce();
    const guidebook = await GuidebookModel.findById(id).lean();
    if (!guidebook) {
      return null;
    }
    return guidebook;
  } catch (error) {
    throw error;
  }
}

/**
 * Tạo hoặc cập nhật link tải xuống
 * @param linkEn Link tiếng Anh
 * @param linkVi Link tiếng Việt
 */

export async function createOrUpdateLinkDownload(linkEn: string, linkVi: string) {
  try {
    await connectToDatabaseOnce();
    const existingConfig = await ConfigLinkDownloadModel.findOne();
    if (existingConfig) {
      existingConfig.link.en = linkEn;
      existingConfig.link.vi = linkVi;
      const res = await existingConfig.save();
      return res;
    }
    const newConfig = new ConfigLinkDownloadModel({
      link: { en: linkEn, vi: linkVi }
    });
    const resNewConfig = await newConfig.save();
    return resNewConfig;
  } catch (error) {
    throw error;
  }
}

export async function getLinkDownload() {
  try {
    await connectToDatabaseOnce();
    return await ConfigLinkDownloadModel.findOne();
  } catch (error) {
    throw error;
  }
}
