import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

interface ConfigLinkDownload extends Document {
  link: {
    en: string;
    vi: string;
  };
}

const ConfigLinkDownloadSchema: Schema = new Schema<ConfigLinkDownload>(
  {
    link: {
      en: { type: String, required: true },
      vi: { type: String, required: true }
    }
  },
  { timestamps: true }
);

// Tạo model từ schema
const ConfigLinkDownloadModel =
  mongoose.models.ConfigLinkDownload ||
  mongoose.model<ConfigLinkDownload>('ConfigLinkDownload', ConfigLinkDownloadSchema);

export default ConfigLinkDownloadModel;
