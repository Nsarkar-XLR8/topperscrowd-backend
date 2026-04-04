import { Favorite } from "./favorite.model";
import mongoose from "mongoose";
import { paginationHelper } from "../../utils/pafinationHelper";

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

const getMyFavorites = async (userId: string, page: string, limit: string) => {
  const { skip, limit: perPage, page: currentPage } = paginationHelper(page, limit);

  const [favorites, total] = await Promise.all([
    Favorite.find({ user: new mongoose.Types.ObjectId(userId) })
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .populate('book')
      .lean(),
    Favorite.countDocuments({ user: new mongoose.Types.ObjectId(userId) })
  ]);

  // Extract books from favorite records
  const books = favorites.map(fav => fav.book);

  return {
    data: books,
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
