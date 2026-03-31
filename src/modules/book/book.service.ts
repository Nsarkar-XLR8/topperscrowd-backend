import AppError from "../../errors/AppError";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { paginationHelper } from "../../utils/pafinationHelper";
import { IBook } from "./book.interface";
import Book from "./book.model";

//create a new book
const createBook = async (req: any) => {
  const payload: IBook = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const result = await Book.create(payload);
  if (!result) throw new AppError("Failed to create book", 400);

  //if image is provided, upload it to cloudinary
  if (files?.image?.[0]) {
    const imageAsset = await uploadToCloudinary(files.image[0].path, "books");
    if (!imageAsset) throw new AppError("Failed to upload image", 400);

    result.image = {
      public_id: imageAsset.public_id,
      secure_url: imageAsset.secure_url,
    };
  }

  //if audio is provided, upload it to cloudinary
  if (files?.audio?.[0]) {
    const audioAsset = await uploadToCloudinary(files.audio[0].path, "books");
    if (!audioAsset) throw new AppError("Failed to upload audio", 400);

    result.audio = {
      public_id: audioAsset.public_id,
      secure_url: audioAsset.secure_url,
    };
  }

  await result.save();

  return result;
};

//get all books
const getAllBooks = async (req: any) => {
  //pagination
  const { page = 1, limit = 10, search, status, from, to, category } = req.query;
  const { skip } = paginationHelper(page, limit);

  const total = await Book.countDocuments();
  const data = await Book.find().skip(skip).limit(limit);
  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  return { data, meta };
};

//get a single book by id 
const getSingleBook = async (req: any) => {
  const { bookId: id } = req.params;
  const result = await Book.findById(id);
  return result;
};

//get book by bookcategory
const getBooksByCategory = async (req: any) => {
  const { category } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const { skip } = paginationHelper(page, limit);

  const total = await Book.countDocuments({ genre: category });
  const data = await Book.find({ genre: category }).skip(skip).limit(limit);
  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  return { data, meta };
};

//update a book by id
const updateBook = async (req: any) => {
  const { bookId: id } = req.params;
  const payload: IBook = req.body;

  const result = await Book.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

//delete a book by id
const deleteBook = async (req: any) => {
  const { bookId: id } = req.params;
  const result = await Book.findByIdAndDelete(id);
  return result;
};
const bookService = {
  createBook,
  getAllBooks,
  getSingleBook,
  getBooksByCategory,
  updateBook,
  deleteBook,
};

export default bookService;
