import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { adminFilterableFields } from "./admin.constant";
import { adminServices } from "./admin.service";

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const filteredQuery = pick(req.query, adminFilterableFields);
  const result = await adminServices.getAllAdminsFromDB(filteredQuery);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admins retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getUniqueAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await adminServices.getUniqueAdminFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin retrieved successfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await adminServices.updateAdminIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await adminServices.deleteAdminFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});

export const adminControllers = {
  getAllAdmin,
  getUniqueAdmin,
  updateAdmin,
  deleteAdmin,
};
