import { Schema } from "mongoose";

export interface IFavorite {
  user: Schema.Types.ObjectId;
  book: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
