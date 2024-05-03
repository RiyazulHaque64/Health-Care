import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { patientFilterableFields } from "./patient.constant";
import { patientServices } from "./patient.service";

const getAllPatients = catchAsync(async (req: Request, res: Response) => {
  const filteredQuery = pick(req.query, patientFilterableFields);
  const result = await patientServices.getAllPatientsFromDB(filteredQuery);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patients retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getUniquePatient = catchAsync(async (req: Request, res: Response) => {
  const result = await patientServices.getUniquePatientFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient retrieved successfully",
    data: result,
  });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const result = await patientServices.updatePatientIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient updated successfully",
    data: result,
  });
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const result = await patientServices.deletePatientFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient deleted successfully",
    data: result,
  });
});

export const patientControllers = {
  getAllPatients,
  getUniquePatient,
  updatePatient,
  deletePatient,
};
