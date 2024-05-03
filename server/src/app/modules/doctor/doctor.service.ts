import { Doctor, Prisma, UserStatus } from "@prisma/client";
import pagination from "../../helper/pagination";
import prisma from "../../shared/prisma";
import { doctorSearchableFields } from "./doctor.constant";

const getAllDoctorsFromDB = async (query: any) => {
  const {
    searchTerm,
    page,
    limit,
    sortBy,
    sortOrder,
    specialities,
    ...remainingQuery
  } = query;

  // Prepare Pagination
  const { pageNumber, limitNumber, skip, sortWith, orderBy } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const andConditions: Prisma.DoctorWhereInput[] = [{ isDeleted: false }];

  if (query.searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => {
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
      andConditions.push({
        [key]: remainingQuery[key],
      });
    });
  }

  if (specialities) {
    andConditions.push({
      doctorSpecialities: {
        some: {
          specialities: {
            title: {
              contains: specialities,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  const whereConditions = {
    AND: andConditions,
  };

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip: skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: orderBy,
    },
    include: {
      doctorSpecialities: {
        include: {
          specialities: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
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

const getUniqueDoctorFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialities: {
        include: {
          specialities: true,
        },
      },
    },
  });
  return result;
};

const updateDoctorIntoDB = async (id: string, payload: any) => {
  const { specialities, ...remainingData } = payload;
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    if (specialities && specialities.length > 0) {
      const removingSpecilities = specialities.filter(
        (speciality: { specialitiesId: string; isDeleted: boolean }) =>
          speciality.isDeleted
      );
      const newSpecilities = specialities.filter(
        (speciality: { specialitiesId: string; isDeleted: boolean }) =>
          !speciality.isDeleted
      );

      for (const speciality of removingSpecilities) {
        await transactionClient.doctorSpecialities.deleteMany({
          where: {
            specialitiesId: speciality.specialitiesId,
            doctorId: id,
          },
        });
      }

      for (const speciality of newSpecilities) {
        await transactionClient.doctorSpecialities.create({
          data: {
            specialitiesId: speciality.specialitiesId,
            doctorId: id,
          },
        });
      }
    }

    const updatedDoctor = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: remainingData,
      include: {
        doctorSpecialities: true,
      },
    });

    return updatedDoctor;
  });
  return result;
};

const deleteDoctorFromDB = async (id: string): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.doctor.update({
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

export const doctorServices = {
  getAllDoctorsFromDB,
  getUniqueDoctorFromDB,
  deleteDoctorFromDB,
  updateDoctorIntoDB,
};
