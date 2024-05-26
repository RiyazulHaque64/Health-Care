import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SpecialitiesServices } from "./specialities.service";

const insertSpecialities = catchAsync(async (req, res) => {
  const result = await SpecialitiesServices.insertSpecialitiesIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Insert specialities successfully",
    data: result,
  });
});

const getAllSpecialities = catchAsync(async (req, res) => {
  const result = await SpecialitiesServices.getAllSpecialitiesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialities retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const deleteSpecialities = catchAsync(async (req, res) => {
  const result = await SpecialitiesServices.deleteSpecialitiesFromDB(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialities deleted successfully",
    data: result,
  });
});

export const SpecialitiesControllers = {
  insertSpecialities,
  getAllSpecialities,
  deleteSpecialities,
};
