import { model, Schema } from "mongoose";
import { IBook } from "./book.interface";

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    price: { type: Number, required: true },
    language: { type: String, required: true },
    reviews: { type: [Schema.Types.ObjectId], ref: "Review" },
    // reviews: { type: [String], required: true },
    saleCount: { type: Number },
    publisher: { type: String, required: true },
    publicationYear: { type: Number, required: true },
    image: {
      public_id: String,
      secure_url: String,
    },
    audio: {
      public_id: String,
      secure_url: String,
    },
  },
  {
    timestamps: true,
  }
);

const Book = model<IBook>("Book", bookSchema);

export default Book;
