import {
  AppointmentStatus,
  PaymentStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../../error/apiError";
import pagination from "../../helper/pagination";
import prisma from "../../shared/prisma";

const createAppointment = async (
  user: JwtPayload,
  data: { doctorId: string; scheduleId: string }
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
      isDeleted: false,
    },
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: data.doctorId,
      isDeleted: false,
    },
  });
  const isBookedSchedule = await prisma.doctorSchedules.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: data.scheduleId,
      },
      isBooked: true,
    },
  });
  if (isBookedSchedule) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "The schedule is already booked"
    );
  }
  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (transactionClient) => {
    const appointment = await transactionClient.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: data.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });
    await transactionClient.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: data.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointment.id,
      },
    });

    const today = new Date();
    const transactionId = `ph-health-care-${today.getDate()}-${
      today.getMonth() + 1
    }-${today.getFullYear()}-${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`;
    const paymentData = {
      appointmentId: appointment.id,
      amount: doctorData.appointmentFee,
      transactionId,
    };
    await transactionClient.payment.create({
      data: paymentData,
    });

    return appointment;
  });

  return result;
};

const getAllAppointmentsFromDB = async (query: any) => {
  const { page, limit, sortBy, sortOrder, ...remainingQuery } = query;

  // Prepare Pagination
  const { pageNumber, limitNumber, skip, sortWith, orderBy } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const whereConditions: Prisma.AppointmentWhereInput[] = [];

  if (Object.keys(remainingQuery).length) {
    Object.keys(remainingQuery).forEach((key) => {
      whereConditions.push({
        [key]: remainingQuery[key],
      });
    });
  }

  const andConditions = {
    AND: whereConditions,
  };

  const result = await prisma.appointment.findMany({
    where: andConditions,
    skip: skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: orderBy,
    },
    include: {
      patient: true,
      doctor: true,
      schedule: true,
    },
  });

  const total = await prisma.appointment.count({
    where: andConditions,
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

const getMyAppointmentFromDB = async (user: JwtPayload, query: any) => {
  const { page, limit, sortBy, sortOrder, ...remainingQuery } = query;

  // Prepare Pagination
  const { pageNumber, limitNumber, skip, sortWith, orderBy } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const whereConditions: Prisma.AppointmentWhereInput[] = [];

  if (Object.keys(remainingQuery).length) {
    Object.keys(remainingQuery).forEach((key) => {
      whereConditions.push({
        [key]: remainingQuery[key],
      });
    });
  }

  if (user.role === UserRole.PATIENT) {
    whereConditions.push({
      patient: {
        email: user.email,
      },
    });
  } else if (user.role === UserRole.DOCTOR) {
    whereConditions.push({
      doctor: {
        email: user.email,
      },
    });
  }

  const andConditions = {
    AND: whereConditions,
  };

  const result = await prisma.appointment.findMany({
    where: andConditions,
    skip: skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: orderBy,
    },
    include:
      user.role === UserRole.PATIENT
        ? {
            doctor: true,
            schedule: true,
          }
        : {
            patient: {
              include: {
                patientHealthData: true,
                medicalReport: true,
              },
            },
            schedule: true,
          },
  });

  const total = await prisma.appointment.count({
    where: andConditions,
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

const changeAppointmentStatus = async (
  user: JwtPayload,
  id: string,
  payload: { status: AppointmentStatus }
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      doctor: true,
    },
  });
  if (user.role === UserRole.DOCTOR) {
    if (!(user.email === appointmentData.doctor.email)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "This is not your appointment"
      );
    }
  }
  const result = await prisma.appointment.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
  });
  return result;
};

const cancelUnpaidAppointments = async () => {
  const thirtyMinuteAgo = new Date(Date.now() - 30 * 60 * 1000);
  const unpaidAppointmentsToCancel = await prisma.appointment.findMany({
    where: {
      createdAt: {
        lte: thirtyMinuteAgo,
      },
      paymentStatus: PaymentStatus.UNPAID,
    },
  });
  const unpaidAppointmentsIds = unpaidAppointmentsToCancel.map(
    (appointment) => appointment.id
  );
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.payment.deleteMany({
      where: {
        appointmentId: {
          in: unpaidAppointmentsIds,
        },
      },
    });
    for (const appointment of unpaidAppointmentsToCancel) {
      await prisma.doctorSchedules.update({
        where: {
          doctorId_scheduleId: {
            doctorId: appointment.doctorId,
            scheduleId: appointment.scheduleId,
          },
        },
        data: {
          isBooked: false,
        },
      });
    }
    await transactionClient.appointment.deleteMany({
      where: {
        id: {
          in: unpaidAppointmentsIds,
        },
      },
    });
  });
};

export const AppointmentServices = {
  createAppointment,
  getMyAppointmentFromDB,
  getAllAppointmentsFromDB,
  changeAppointmentStatus,
  cancelUnpaidAppointments,
};
