import httpStatus from "http-status";
import ApiError from "../../error/apiError";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PaymentServices } from "./payment.service";

const initPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.initPayment(req.params.appointmentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment initiate successfully",
    data: result,
  });
});

const validatePayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.validatePayment(req.query);
  if (!result) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

export const PaymentControllers = {
  initPayment,
  validatePayment,
};
