import express from 'express';
import { CartController } from './cart.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';


const router = express.Router();

// Only authenticated users (Customers/Owners) can manage a cart
router.post(
    '/add-to-cart',
    auth(USER_ROLE.USER),
    CartController.addToCart
);

export const CartRouter = router;