import { Admin, Prisma, UserStatus } from "@prisma/client";
import pagination from "../../helper/pagination";
import prisma from "../../shared/prisma";
import { adminSearchableFields } from "./admin.constant";

const getAllAdminsFromDB = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...remainingQuery } =
    query;

  // Prepare Pagination
  const { pageNumber, limitNumber, skip, sortWith, orderBy } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const whereConditions: Prisma.AdminWhereInput[] = [{ isDeleted: false }];
  if (query.searchTerm) {
    whereConditions.push({
      OR: adminSearchableFields.map((field) => {
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

  const result = await prisma.admin.findMany({
    where: andConditions,
    skip: skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: orderBy,
    },
  });

  const total = await prisma.admin.count({
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

const getUniqueAdminFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateAdminIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteAdminFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminDeletedData;
  });
  return result;
};

export const adminServices = {
  getAllAdminsFromDB,
  getUniqueAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};
