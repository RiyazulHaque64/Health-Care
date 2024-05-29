import { Prisma, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { fileUploader } from "../../helper/fileUploader";
import pagination from "../../helper/pagination";
import prisma from "../../shared/prisma";
import { userSearchableFields } from "./user.constant";

const createUser = async (req: Request) => {
  const file = req.file;
  const data = req.body;

  if (file) {
    const cloudinaryResponse = await fileUploader.uploadToCloudinary(file);
    data.admin.profilePhoto = cloudinaryResponse?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    const user = await transactionClient.user.create({
      data: userData,
    });

    const admin = await transactionClient.admin.create({
      data: data.admin,
    });

    return {
      user,
      admin,
    };
  });
  return result;
};

const createDoctor = async (req: Request) => {
  const file = req.file;
  const data = req.body;

  if (file) {
    const cloudinaryResponse = await fileUploader.uploadToCloudinary(file);
    data.doctor.profilePhoto = cloudinaryResponse?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const userData = {
    email: data.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    const user = await transactionClient.user.create({
      data: userData,
    });

    const doctor = await transactionClient.doctor.create({
      data: data.doctor,
    });

    return {
      user,
      doctor,
    };
  });
  return result;
};

const createPatient = async (req: Request) => {
  const file = req.file;
  const data = req.body;

  if (file) {
    const cloudinaryResponse = await fileUploader.uploadToCloudinary(file);
    data.patient.profilePhoto = cloudinaryResponse?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const userData = {
    email: data.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    const user = await transactionClient.user.create({
      data: userData,
    });

    const patient = await transactionClient.patient.create({
      data: data.patient,
    });

    return {
      user,
      patient,
    };
  });
  return result;
};

const getAllUsersFromDB = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...remainingQuery } =
    query;

  // Prepare Pagination
  const { pageNumber, limitNumber, skip, sortWith, orderBy } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const whereConditions: Prisma.UserWhereInput[] = [];
  if (query.searchTerm) {
    whereConditions.push({
      OR: userSearchableFields.map((field) => {
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

  const andConditions =
    whereConditions.length > 0
      ? {
          AND: whereConditions,
        }
      : {};

  const result = await prisma.user.findMany({
    where: andConditions,
    skip: skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: orderBy,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count({
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

const changeProfileStatusIntoDB = async (
  id: string,
  data: { status: UserStatus }
) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const updateStatus = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: data.status,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return updateStatus;
};

const getProfileFromDB = async (user: JwtPayload) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE || UserStatus.BLOCKED,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
    },
  });

  let profileData;
  if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
    profileData = await prisma.admin.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });
  } else if (user.role === UserRole.DOCTOR) {
    profileData = await prisma.doctor.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });
  } else {
    profileData = await prisma.patient.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });
  }

  return {
    ...userData,
    ...profileData,
  };
};

const updateMyProfileIntoDB = async (req: Request, user: JwtPayload) => {
  const file = req.file;
  const data = req.body;

  if (file) {
    const cloudinaryResponse = await fileUploader.uploadToCloudinary(file);
    data.profilePhoto = cloudinaryResponse?.secure_url;
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
    },
  });

  let profileData;

  if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
    profileData = await prisma.admin.update({
      where: {
        email: user.email,
      },
      data,
    });
  } else if (user.role === UserRole.DOCTOR) {
    profileData = await prisma.doctor.update({
      where: {
        email: user.email,
      },
      data,
    });
  } else {
    profileData = await prisma.patient.update({
      where: {
        email: user.email,
      },
      data,
    });
  }

  return {
    ...userData,
    ...profileData,
  };
};

export const userServices = {
  createUser,
  createDoctor,
  createPatient,
  getAllUsersFromDB,
  changeProfileStatusIntoDB,
  getProfileFromDB,
  updateMyProfileIntoDB,
};
