import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { doctorFilterableFields } from "./doctor.constant";
import { doctorServices } from "./doctor.service";

const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
  const filteredQuery = pick(req.query, doctorFilterableFields);
  const result = await doctorServices.getAllDoctorsFromDB(filteredQuery);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctors retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getUniqueDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await doctorServices.getUniqueDoctorFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor retrieved successfully",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await doctorServices.updateDoctorIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor updated successfully",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await doctorServices.deleteDoctorFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});

export const doctorControllers = {
  getAllDoctor,
  getUniqueDoctor,
  deleteDoctor,
  updateDoctor,
};
