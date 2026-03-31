import bookCategoryRouter from "../modules/bookCategory/bookCategory.router";
import { Router } from "express";
import userRouter from "../modules/user/user.router";
import authRouter from "../modules/auth/auth.router";
import { CartRouter } from "../modules/cart/cart.routes";
import bookRouter from "../modules/book/book.router";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/bookcategory",
    route: bookCategoryRouter,
  },
  {
    path: "/book",
    route: bookRouter,
  },
  {
    path: "/cart",
    route: CartRouter,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
