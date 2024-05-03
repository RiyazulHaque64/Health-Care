import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { reviewFilterableFields } from "./review.constant";
import { ReviewServices } from "./review.service";

const createReview = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await ReviewServices.createReview(req.user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Review created successfully",
      data: result,
    });
  }
);

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const filteredQuery = pick(req.query, reviewFilterableFields);
  const result = await ReviewServices.getAllReviewsFromDB(filteredQuery);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const ReviewControllers = {
  createReview,
  getAllReviews,
};
