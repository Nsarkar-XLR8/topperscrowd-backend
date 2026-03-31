import { Router } from "express";
import { bookController } from "./book.controller";
import { BookValidation } from "./book.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { upload } from "../../middleware/multer.middleware";

const router = Router();

router.post(
  "/create-book",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  validateRequest(BookValidation.createBookSchema),
  bookController.createBook
);

const bookRouter = router;
export default bookRouter;
