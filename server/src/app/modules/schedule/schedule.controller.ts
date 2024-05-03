import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { scheduleFilterableFields } from "./schedule.constant";
import { scheduleServices } from "./schedule.service";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleServices.createScheduleIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});

const getAllSchedules = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const filteredQuery = pick(req.query, scheduleFilterableFields);
    const result = await scheduleServices.getAllSchedulesFromDB(
      req.user,
      filteredQuery
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Schedules retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const scheduleControllers = {
  createSchedule,
  getAllSchedules,
};
