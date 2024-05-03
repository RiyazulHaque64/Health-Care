import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { MetaServices } from "./meta.service";

const fetchDashboardMetaData = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await MetaServices.fetchDashboardMetaData(req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Meta data retrieved successfully",
      data: result,
    });
  }
);

export const MetaControllers = {
  fetchDashboardMetaData,
};
