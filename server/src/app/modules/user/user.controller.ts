import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { userFilterableFields } from "./user.constant";
import { userServices } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createUser(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createDoctor(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createPatient(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filteredQuery = pick(req.query, userFilterableFields);
  const result = await userServices.getAllUsersFromDB(filteredQuery);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.changeProfileStatusIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

const getProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await userServices.getProfileFromDB(req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile retrieved successfully",
      data: result,
    });
  }
);

const updateMyProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await userServices.updateMyProfileIntoDB(req, req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  }
);

export const userControllers = {
  createUser,
  createDoctor,
  createPatient,
  getAllUser,
  changeProfileStatus,
  getProfile,
  updateMyProfile,
};
