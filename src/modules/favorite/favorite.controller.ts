import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { favoriteService } from "./favorite.service";

const toggleFavorite = catchAsync(async (req, res) => {
  const { bookId } = req.body;
  const result = await favoriteService.toggleFavorite(req.user.id, bookId);
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.added ? "Book added to favorites" : "Book removed from favorites",
    data: result,
  });
});

const getMyFavorites = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await favoriteService.getMyFavorites(req.user.id, req.user, page as string, limit as string);
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Favorite books retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const favoriteController = {
  toggleFavorite,
  getMyFavorites,
};
