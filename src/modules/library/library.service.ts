import { Order } from "../order/order.model";
import ListenerProgress from "../listenerProgress/listenerProgress.model";
import Book from "../book/book.model";
import { Favorite } from "../favorite/favorite.model";
import { paginationHelper } from "../../utils/pafinationHelper";
import mongoose from "mongoose";

const getLibraryStats = async (userId: string) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    purchasedBooks,
    newPurchasedBooks,
    listeningTime,
    listeningTimeThisWeek,
    totalFavorites,
    addedFavorites
  ] = await Promise.all([
    Order.find({ userId: new mongoose.Types.ObjectId(userId), paymentStatus: 'paid' }).distinct('items.book'),
    Order.find({ 
      userId: new mongoose.Types.ObjectId(userId), 
      paymentStatus: 'paid',
      createdAt: { $gte: sevenDaysAgo }
    }).distinct('items.book'),
    ListenerProgress.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$progress' } } }
    ]),
    ListenerProgress.aggregate([
      { $match: { 
        user: new mongoose.Types.ObjectId(userId), 
        updatedAt: { $gte: sevenDaysAgo } 
      } },
      { $group: { _id: null, total: { $sum: '$progress' } } }
    ]),
    Favorite.countDocuments({ user: new mongoose.Types.ObjectId(userId) }),
    Favorite.countDocuments({ 
      user: new mongoose.Types.ObjectId(userId),
      createdAt: { $gte: sevenDaysAgo }
    })
  ]);

  return {
    totalAudiobooks: purchasedBooks.length,
    newAudiobooks: newPurchasedBooks.length,
    totalListeningTime: listeningTime[0]?.total || 0,
    listeningTimeThisWeek: listeningTimeThisWeek[0]?.total || 0,
    favorites: totalFavorites,
    addedFavorites: addedFavorites,
  };
};

const getContinueListening = async (userId: string) => {
  const result = await ListenerProgress.findOne({ user: new mongoose.Types.ObjectId(userId) })
    .sort({ lastListenedAt: -1 })
    .populate('book')
    .lean();

  return result;
};

const getRecentPurchases = async (userId: string) => {
    // Get unique book IDs from the latest paid orders, limit to 6
    const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId), paymentStatus: 'paid' }).limit(6)
      .sort({ createdAt: -1 })
      .select('items.book')
      .lean();
    
    const uniqueBookIds = new Set<string>();
    for (const order of orders) {
      for (const item of order.items) {
        uniqueBookIds.add(String(item.book));
        if (uniqueBookIds.size >= 6) break;
      }
      if (uniqueBookIds.size >= 6) break;
    }

    const books = await Book.find({ _id: { $in: Array.from(uniqueBookIds) } }).lean();
    
    // Maintain the order of purchase if possible, or just return the books
    return books;
};

const getMyBooks = async (userId: string, page: string, limit: string) => {
  const { skip, limit: perPage, page: currentPage } = paginationHelper(page, limit);

  const purchasedBookIds = await Order.find({ 
    userId: new mongoose.Types.ObjectId(userId), 
    paymentStatus: 'paid' 
  }).distinct('items.book');

  const [books, total] = await Promise.all([
    Book.find({ _id: { $in: purchasedBookIds } })
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .populate('genre', 'title')
      .lean(),
    Book.countDocuments({ _id: { $in: purchasedBookIds } })
  ]);

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

const libraryService = {
  getLibraryStats,
  getContinueListening,
  getRecentPurchases,
  getMyBooks,
};

export default libraryService;
