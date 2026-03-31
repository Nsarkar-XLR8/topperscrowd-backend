import { Router } from "express";
import { bookCategoryController } from "./bookCategory.controller";
import { BookCategoryValidation } from "./bookCategory.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { upload } from "../../middleware/multer.middleware";
// import validateRequest from "../../middleware/validateRequest";
// import { BookCategoryValidation } from "./bookCategory.validation";

const router = Router();

router.post(
  "/create-bookcategory",
  upload.single("image"),
  validateRequest(BookCategoryValidation.createBookCategorySchema),
  bookCategoryController.createBookCategory
);

router.get("/get-all-bookcategories", bookCategoryController.getAllBookCategories);

router.get("/get-bookcategory/:bookcategoryId", bookCategoryController.getBookCategoryById);

router.patch(
  "/update-bookcategory/:bookcategoryId",
  upload.single("image"),
  validateRequest(BookCategoryValidation.updateBookCategorySchema),
  bookCategoryController.updateBookCategoryById
);

router.delete("/delete-bookcategory/:bookcategoryId", bookCategoryController.deleteBookCategoryById);

const bookCategoryRouter = router;
export default bookCategoryRouter;
