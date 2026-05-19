import express from 'express';
import { CouponController } from './coupon.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { validateRequest } from '../../middleware/validateRequest';
import { CouponValidation } from './coupon.validation';

const router = express.Router();

router.post(
  '/create-coupon',
  // #swagger.tags = ['Coupons']
  // #swagger.summary = 'Create a new coupon (Admin only)'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["email", "codeName", "expiryDate", "usesLimit", "discountType", "discountAmount"],
          properties: {
            email: { type: "string", example: "user@example.com" },
            codeName: { type: "string", example: "SAVE20" },
            expiryDate: { type: "string", example: "2024-12-31" },
            usesLimit: { type: "integer", example: 100 },
            discountType: { type: "string", enum: ["flat", "percentage"], example: "percentage" },
            discountAmount: { type: "number", example: 20 }
          }
        }
      }
    }
  } */
  auth(USER_ROLE.ADMIN),
  validateRequest(CouponValidation.createCouponSchema),
  CouponController.createCoupon
);

router.get(
  '/my-coupons',
  // #swagger.tags = ['Coupons']
  // #swagger.summary = 'Get my coupons'
  // #swagger.security = [{ "bearerAuth": [] }]
  auth(USER_ROLE.USER),
  CouponController.getMyCoupons
);

router.get(
  '/all-coupons',
  // #swagger.tags = ['Coupons']
  // #swagger.summary = 'Get all coupons'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['page'] = {
        in: 'query',
        description: 'Page number for pagination',
        type: 'integer',
        example: 1
  } */
  /* #swagger.parameters['limit'] = {
        in: 'query',
        description: 'Number of coupons per page',
        type: 'integer',
        example: 10
  } */
  auth(USER_ROLE.ADMIN),
  CouponController.getAllCoupons
);

export const CouponRouter = router;
