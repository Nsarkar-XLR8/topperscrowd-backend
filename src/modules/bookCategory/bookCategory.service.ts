import mongoose from "mongoose";
import CustomError from "../../errors/customError";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary";
import { paginationHelper } from "../../utils/pafinationHelper";
import { IBookCategory, IBookCategoryUpdate } from "./bookCategory.interface";
import BookCategory from "./bookCategory.model";
import AppError from "../../errors/AppError";

//create a new book category
const createBookCategory = async (req: any) => {

  const payload: IBookCategory = req.body;
  const image = req.file;

  const result = await BookCategory.create(payload);
  if (!result) throw new CustomError(400, "Failed to create book category");

  //if image is provided, upload it to cloudinary
  if (image) {
    const imageAsset = await uploadToCloudinary(image.path, "bookCategory");
    if (!imageAsset) throw new CustomError(400, "Failed to upload image");

    result.image = {
      public_id: imageAsset.public_id,
      secure_url: imageAsset.secure_url,
    };

    await result.save();
  }


  return result;
};

//get all book categories
const getAllBookCategories = async (req: any) => {
  const {
    page = 1,
    limit = 10,
    search,
    status = "all", // active, inactive, all
    from,   // date range start
    to,     // date range end
  } = req.query;

  const { skip, limit: perPage } = paginationHelper(page, limit);

  // Build filter object
  const filter: any = {};

  // Search (name/title)
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Status filter
  if (status && status !== "all") {
    // validate status can be "active" or "inactive"  
    if (status !== "active" && status !== "inactive" && status !== "all") {
      throw new CustomError(400, "Invalid status. Must be 'active' or 'inactive'");
    }
    filter.isActive = status == "active" ? true : false;
  }

  // Date range filter
  if (from || to) {

    //validate from and to are valid dates
    if (from && isNaN(Date.parse(from))) {
      throw new CustomError(400, "Invalid 'from' date");
    }
    if (to && isNaN(Date.parse(to))) {
      throw new CustomError(400, "Invalid 'to' date");
    }

    filter.createdAt = {};
    if (from) {
      filter.createdAt.$gte = new Date(from);
    }
    if (to) {
      filter.createdAt.$lte = new Date(to);
    }
  }

  // Query with pagination
  const [data, total] = await Promise.all([
    BookCategory.find(filter)
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 }), // latest first
    BookCategory.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      page: Number(page),
      limit: Number(perPage),
      total,
      totalPage: Math.ceil(total / perPage),
    },
  };
};

//get a single book category by id
const getBookCategoryById = async (req: any) => {
  const { bookcategoryId } = req.params;

  if (!mongoose.isValidObjectId(bookcategoryId)) throw new CustomError(400, "Invalid book category id");

  const result = await BookCategory.findById(bookcategoryId);
  if (!result) throw new CustomError(404, "Book category not found");

  return result;
};

//update a book category by id
const updateBookCategoryById = async (req: any) => {
  const { bookcategoryId } = req.params;
  const payload: IBookCategoryUpdate = req.body;
  const image = req.file;

  const result = await BookCategory.findByIdAndUpdate(bookcategoryId, payload, { new: true });
  if (!result) throw new CustomError(404, "Book category not found");

  //if image is provided, upload it to cloudinary
  if (image) {
    //delete old image from cloudinary if exists
    if (result.image?.public_id) await deleteFromCloudinary(result.image.public_id);


    //upload new image to cloudinary
    const imageAsset = await uploadToCloudinary(image.path, "bookCategory");
    if (!imageAsset) throw new CustomError(400, "Failed to upload image");

    result.image = {
      public_id: imageAsset.public_id,
      secure_url: imageAsset.secure_url,
    };

    await result.save();
  }

  return result;
};

//delete a book category by id
const deleteBookCategoryById = async (req: any) => {
  const { bookcategoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookcategoryId)) throw new CustomError(400, "Invalid book category ID");


  const result = await BookCategory.findByIdAndDelete(bookcategoryId);
  if (!result) throw new CustomError(404, "Book category not found");

  if (result.image?.public_id) await deleteFromCloudinary(result.image.public_id);
};

const bookCategoryService = {
  createBookCategory,
  getAllBookCategories,
  getBookCategoryById,
  updateBookCategoryById,
  deleteBookCategoryById,
};

export default bookCategoryService;
