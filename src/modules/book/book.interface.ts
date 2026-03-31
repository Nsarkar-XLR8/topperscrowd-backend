import mongoose, { Model } from "mongoose";

export interface IBook {
  title: string;
  description: string;
  author: string;
  genre: string;
  price: number;
  language: string;
  reviews : mongoose.Types.ObjectId[];
  saleCount: number;
  publisher: string;
  publicationYear: number;
  image: {
    public_id: string;
    secure_url: string;
  };
  audio?: {
    public_id: string;
    secure_url: string;
  };
}

export type BookModel = Model<IBook>;
