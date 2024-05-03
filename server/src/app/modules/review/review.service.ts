import { AppointmentStatus, Prisma, Review } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../error/apiError";
import pagination from "../../helper/pagination";
import prisma from "../../shared/prisma";
import { reviewSearchableFields } from "./review.constant";

const createReview = async (user: JwtPayload, data: Partial<Review>) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: data.appointmentId,
      status: AppointmentStatus.COMPLETED,
    },
    include: {
      patient: true,
    },
  });
  if (user.email !== appointmentData.patient.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment");
  }
  const result = await prisma.$transaction(async (tx) => {
    const reviewData = await prisma.review.create({
      data: {
        appointmentId: appointmentData.id,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        rating: data.rating as number,
        comment: data.comment as string,
      },
      include: {
        doctor: true,
        patient: true,
        appointment: true,
      },
    });
    const averageRating = await prisma.review.aggregate({
      where: {
        doctorId: reviewData.doctorId,
      },
      _avg: {
        rating: true,
      },
    });
    await prisma.doctor.update({
      where: {
        id: reviewData.doctorId,
      },
      data: {
        averageRating: averageRating._avg.rating as number,
      },
    });
    return reviewData;
  });
  return result;
};

const getAllReviewsFromDB = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...remainingQuery } =
    query;

  // Prepare Pagination
  const { pageNumber, limitNumber, skip, sortWith, orderBy } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const whereConditions: Prisma.ReviewWhereInput[] = [];
  if (query.searchTerm) {
    whereConditions.push({
      OR: reviewSearchableFields.map((field) => {
        return {
          [field]: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }
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

  const result = await prisma.review.findMany({
    where: andConditions,
    skip: skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: orderBy,
    },
  });

  const total = await prisma.review.count({
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

export const ReviewServices = {
  createReview,
  getAllReviewsFromDB,
};
