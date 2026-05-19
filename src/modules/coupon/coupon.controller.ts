import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CouponService } from './coupon.service';

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  // Expected to be called by ADMIN
  const result = await CouponService.createCoupon(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Coupon created and emailed successfully',
    data: result,
  });
});

const getMyCoupons = catchAsync(async (req: Request, res: Response) => {
  // Called by USER
  const userId = req.user.id;
  const result = await CouponService.getMyCoupons(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Active coupons retrieved successfully',
    data: result,
  });
});

const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.getAllCouponsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All coupons retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const applyCoupon = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await CouponService.applyCouponAndCalculate(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon applied and discount calculated successfully',
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const { couponId } = req.params;
  const result = await CouponService.deleteCouponFromDB(couponId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon deleted successfully',
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getMyCoupons,
  getAllCoupons,
  applyCoupon,
  deleteCoupon
};
