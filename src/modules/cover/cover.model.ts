import { Schema, model } from 'mongoose';
import { ICover } from './cover.interface';

const coverSchema = new Schema<ICover>(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    image: {
      public_id: String,
      url: String,
    },
    edition: { 
      type: String, 
      required: true,
      trim: true
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Cover = model<ICover>('Cover', coverSchema);