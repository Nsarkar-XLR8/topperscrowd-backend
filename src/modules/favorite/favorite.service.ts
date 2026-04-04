import { Favorite } from "./favorite.model";
import mongoose from "mongoose";
import { paginationHelper } from "../../utils/pafinationHelper";
import { Order } from "../order/order.model";
import { transformBookResponse } from "../book/book.utils";

const toggleFavorite = async (userId: string, bookId: string) => {
  const favorite = await Favorite.findOne({
    user: new mongoose.Types.ObjectId(userId),
    book: new mongoose.Types.ObjectId(bookId),
  });

  if (favorite) {
    await Favorite.findByIdAndDelete(favorite._id);
    return { added: false };
  } else {
    await Favorite.create({
      user: new mongoose.Types.ObjectId(userId),
      book: new mongoose.Types.ObjectId(bookId),
    });
    return { added: true };
  }
};

const getMyFavorites = async (userId: string, user: any, page: string, limit: string) => {
  const { skip, limit: perPage, page: currentPage } = paginationHelper(page, limit);

  // 1. Fetch purchased book IDs if not admin
  let purchasedBookIds: string[] = [];
  if (user.role !== 'admin') {
    const purchased = await Order.find({
      userId: userId,
      paymentStatus: 'paid'
    }).distinct('items.book');
    purchasedBookIds = (purchased as any).map((id: any) => id.toString());
  }

  // 2. Fetch favorites
  const [favorites, total] = await Promise.all([
    Favorite.find({ user: new mongoose.Types.ObjectId(userId) })
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .populate('book')
      .lean(),
    Favorite.countDocuments({ user: new mongoose.Types.ObjectId(userId) })
  ]);

  // 3. Extract and transform books
  const books = favorites.map(fav => fav.book);
  const transformedBooks = transformBookResponse(books, user, purchasedBookIds);

  return {
    data: transformedBooks,
    meta: {
      total,
      page: currentPage,
      limit: perPage,
      totalPage: Math.ceil(total / perPage),
    },
  };
};

export const favoriteService = {
  toggleFavorite,
  getMyFavorites,
};
