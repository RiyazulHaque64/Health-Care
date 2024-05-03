import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { appointmentFilterableFields } from "./appointment.constant";
import { AppointmentServices } from "./appointment.service";

const createAppointment = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await AppointmentServices.createAppointment(
      req.user,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Appointment taken successfully",
      data: result,
    });
  }
);

const getAllAppointments = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const filteredQuery = pick(req.query, appointmentFilterableFields);
    const result = await AppointmentServices.getAllAppointmentsFromDB(
      filteredQuery
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Appointments retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getMyAppointment = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const filteredQuery = pick(req.query, appointmentFilterableFields);
    const result = await AppointmentServices.getMyAppointmentFromDB(
      req.user,
      filteredQuery
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Appointments retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const changeAppointmentStatus = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await AppointmentServices.changeAppointmentStatus(
      req.user,
      req.params.id,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Appointment status changed successfully",
      data: result,
    });
  }
);

export const AppointmentControllers = {
  createAppointment,
  getMyAppointment,
  getAllAppointments,
  changeAppointmentStatus,
};
