import { model, Schema } from "mongoose";
import { IFavorite } from "./favorite.interface";

const favoriteSchema = new Schema<IFavorite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Ensure one favorite per user per book
favoriteSchema.index({ user: 1, book: 1 }, { unique: true });

export const Favorite = model<IFavorite>("Favorite", favoriteSchema);
