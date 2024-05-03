import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { PrescriptionServices } from "./prescription.service";

const createPrescription = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await PrescriptionServices.createPrescription(
      req.user,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Prescription generated successfully",
      data: result,
    });
  }
);

const patientPrescription = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const filteredQuery = pick(req.query, [
      "limit",
      "page",
      "sortBy",
      "sortOrder",
    ]);
    const result = await PrescriptionServices.patientPrescription(
      req.user,
      filteredQuery
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Prescriptions retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const PrescriptionControllers = {
  createPrescription,
  patientPrescription,
};
