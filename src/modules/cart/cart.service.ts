import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Cart } from './cart.model';


const addToCartIntoDB = async (userId: string, bookId: string, quantity: number) => {
  // 1. Verify the book exists
  const book = await Book.findById(bookId);
  if (!book) {
    throw new AppError( 'Audiobook not found', httpStatus.NOT_FOUND);
  }

  // 2. Find the user's cart
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // Create new cart if it doesn't exist
    cart = await Cart.create({
      user: userId,
      items: [{ book: bookId, quantity }],
      totalPrice: book.price * quantity,
    });
  } else {
    // 3. Check if the book is already in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.book.toString() === bookId
    );

    if (existingItemIndex > -1) {
      // Update quantity if already exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to existing cart
      cart.items.push({ book: bookId as any, quantity });
    }

    // 4. Re-calculate Total Price (Always trust the DB price, not the request)
    // We populate the books to get current prices
    const populatedCart = await cart.populate('items.book');
    
    cart.totalPrice = populatedCart.items.reduce((total, item: any) => {
      return total + (item.book.price * item.quantity);
    }, 0);

    await cart.save();
  }

  return cart;
};

export const CartService = {
  addToCartIntoDB,
};