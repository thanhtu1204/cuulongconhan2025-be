import type { Document, Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface Guidebook extends Document {
  title: string;
  htmlContent: string;
  type: string;
}

const guidebookSchema = new Schema<Guidebook>({
  title: { type: String, required: true },
  htmlContent: { type: String, required: true },
  type: { type: String, required: true }
});

guidebookSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const GuidebookModel: Model<Guidebook> =
  mongoose.models.Guidebook || mongoose.model('Guidebook', guidebookSchema);
export default GuidebookModel;
