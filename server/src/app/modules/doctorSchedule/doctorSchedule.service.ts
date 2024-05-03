import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../error/apiError";
import pagination from "../../helper/pagination";
import prisma from "../../shared/prisma";

const bookDoctorSchedulesIntoDB = async (
  user: JwtPayload,
  payload: { scheduleIds: string[] }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
      isDeleted: false,
    },
  });
  const doctorSchedules = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));
  const result = await prisma.doctorSchedules.createMany({
    data: doctorSchedules,
  });
  return result;
};

const getAllDoctorSchedulesFromDB = async (query: any) => {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    startDate,
    endDate,
    ...remainingQuery
  } = query;

  // Prepare Pagination
  const { pageNumber, limitNumber, skip } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const andConditions: Prisma.DoctorSchedulesWhereInput[] = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(remainingQuery).length) {
    if (
      typeof remainingQuery.isBooked === "string" &&
      remainingQuery.isBooked === "true"
    ) {
      remainingQuery.isBooked = true;
    } else if (
      typeof remainingQuery.isBooked === "string" &&
      remainingQuery.isBooked === "false"
    ) {
      remainingQuery.isBooked = false;
    }
    Object.keys(remainingQuery).forEach((key) => {
      andConditions.push({
        [key]: remainingQuery[key],
      });
    });
  }

  const whereConditions = {
    AND: andConditions,
  };

  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    skip: skip,
    take: limitNumber,
    include: {
      schedule: true,
    },
  });

  const total = await prisma.doctorSchedules.count({
    where: whereConditions,
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

const getMySchedulesFromDB = async (user: JwtPayload, query: any) => {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    startDate,
    endDate,
    ...remainingQuery
  } = query;

  // Prepare Pagination
  const { pageNumber, limitNumber, skip } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const andConditions: Prisma.DoctorSchedulesWhereInput[] = [
    { doctorId: doctorData.id },
  ];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(remainingQuery).length) {
    if (
      typeof remainingQuery.isBooked === "string" &&
      remainingQuery.isBooked === "true"
    ) {
      remainingQuery.isBooked = true;
    } else if (
      typeof remainingQuery.isBooked === "string" &&
      remainingQuery.isBooked === "false"
    ) {
      remainingQuery.isBooked = false;
    }
    Object.keys(remainingQuery).forEach((key) => {
      andConditions.push({
        [key]: remainingQuery[key],
      });
    });
  }

  const whereConditions = {
    AND: andConditions,
  };

  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    skip: skip,
    take: limitNumber,
    include: {
      schedule: true,
    },
  });

  const total = await prisma.doctorSchedules.count({
    where: whereConditions,
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

const deleteMySchedule = async (user: JwtPayload, id: string) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const isBookSchedule = await prisma.doctorSchedules.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: id,
      },
      isBooked: true,
    },
  });
  if (isBookSchedule) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You cann't delete the schedule because of the schedule is already booked"
    );
  }
  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: id,
      },
    },
  });
  return result;
};

export const doctorScheduleServices = {
  bookDoctorSchedulesIntoDB,
  getAllDoctorSchedulesFromDB,
  getMySchedulesFromDB,
  deleteMySchedule,
};
