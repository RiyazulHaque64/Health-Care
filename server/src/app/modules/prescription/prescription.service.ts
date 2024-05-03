import { AppointmentStatus, PaymentStatus, Prescription } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../error/apiError";
import pagination from "../../helper/pagination";
import prisma from "../../shared/prisma";

const createPrescription = async (
  user: JwtPayload,
  data: Partial<Prescription>
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: data.appointmentId,
      paymentStatus: PaymentStatus.PAID,
      status: AppointmentStatus.COMPLETED,
    },
    include: {
      doctor: true,
    },
  });
  if (user.email !== appointmentData.doctor.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment");
  }
  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: data.instructions as string,
      followUpDate: data.followUpDate || null,
    },
    include: {
      patient: true,
    },
  });
  return result;
};

const patientPrescription = async (user: JwtPayload, query: any) => {
  const { page, limit, sortBy, sortOrder } = query;

  // Prepare Pagination
  const { pageNumber, limitNumber, skip, sortWith, orderBy } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const result = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user.email,
      },
    },
    skip: skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: orderBy,
    },
  });

  const total = await prisma.prescription.count({
    where: {
      patient: {
        email: user.email,
      },
    },
  });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
    data: result,
  };
};

export const PrescriptionServices = {
  createPrescription,
  patientPrescription,
};
