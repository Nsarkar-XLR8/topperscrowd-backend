import { model, Schema } from "mongoose";
import { IBookCategory } from "./bookCategory.interface";

const bookCategorySchema = new Schema<IBookCategory>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      public_id: String,
      secure_url: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//pre middleware to avoid duplicate titles when creating
bookCategorySchema.pre("save", async function (next) {
  if (this.isModified("title") || this.isNew) {
    const existingCategory = await BookCategory.findOne({ title: this.title, _id: { $ne: this._id } });
    if (existingCategory) {
      throw new Error("Book category with this title already exists");
    }
  }
  next();
});

//pre middleware to avoid duplicate titles when updating
bookCategorySchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  if (update && update.title) {
    const existingCategory = await BookCategory.findOne({ title: update.title, _id: { $ne: this.getQuery()._id } });
    if (existingCategory) {
      throw new Error("Book category with this title already exists");
    }
  }
  next();
});


const BookCategory = model<IBookCategory>("BookCategory", bookCategorySchema);

export default BookCategory;
