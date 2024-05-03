import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { doctorScheduleFilterableFields } from "./doctorSchedule.constant";
import { doctorScheduleServices } from "./doctorSchedule.service";

const bookDoctorSchedules = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await doctorScheduleServices.bookDoctorSchedulesIntoDB(
      req.user,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor schedules booked successfully",
      data: result,
    });
  }
);

const getMySchedules = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const filteredQuery = pick(req.query, doctorScheduleFilterableFields);
    const result = await doctorScheduleServices.getMySchedulesFromDB(
      req.user,
      filteredQuery
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor Schedules retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getAllDoctorSchedules = catchAsync(
  async (req: Request, res: Response) => {
    const filteredQuery = pick(req.query, doctorScheduleFilterableFields);
    const result = await doctorScheduleServices.getAllDoctorSchedulesFromDB(
      filteredQuery
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor Schedules retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const deleteMySchedule = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await doctorScheduleServices.deleteMySchedule(
      req.user,
      req.params.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor Schedule deleted successfully",
      data: result,
    });
  }
);

export const doctorScheduleControllers = {
  bookDoctorSchedules,
  getAllDoctorSchedules,
  getMySchedules,
  deleteMySchedule,
};
