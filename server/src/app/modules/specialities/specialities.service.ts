import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import pagination from "../../helper/pagination";
import prisma from "../../shared/prisma";

const insertSpecialitiesIntoDB = async (req: Request) => {
  const file = req.file;
  const data = req.body;
  if (file) {
    const cloudinaryResponse = await fileUploader.uploadToCloudinary(file);
    data.icon = cloudinaryResponse?.secure_url;
  }
  const result = await prisma.specialities.create({
    data,
  });
  return result;
};

const getAllSpecialitiesFromDB = async (query: any) => {
  const { page, limit, sortBy, sortOrder } = query;

  // Prepare Pagination
  const { pageNumber, limitNumber, skip, sortWith, orderBy } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });
  const result = await prisma.specialities.findMany();
  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total: result.length,
    },
    data: result,
  };
};

const deleteSpecialitiesFromDB = async (id: string) => {
  await prisma.specialities.delete({
    where: {
      id,
    },
  });
  return null;
};

export const SpecialitiesServices = {
  insertSpecialitiesIntoDB,
  getAllSpecialitiesFromDB,
  deleteSpecialitiesFromDB,
};
