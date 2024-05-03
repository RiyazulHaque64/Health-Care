import { Patient, Prisma, UserStatus } from "@prisma/client";
import pagination from "../../helper/pagination";
import prisma from "../../shared/prisma";
import { patientSearchableFields } from "./patient.constant";

const getAllPatientsFromDB = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...remainingQuery } =
    query;

  // Prepare Pagination
  const { pageNumber, limitNumber, skip, sortWith, orderBy } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const andConditions: Prisma.PatientWhereInput[] = [{ isDeleted: false }];

  if (query.searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => {
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

  const whereConditions = {
    AND: andConditions,
  };

  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip: skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: orderBy,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  const total = await prisma.patient.count({
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

const getUniquePatientFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
  return result;
};

const updatePatientIntoDB = async (id: string, payload: any) => {
  const { patientHealthData, medicalReport, ...remainingData } = payload;
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  await prisma.patient.findUniqueOrThrow({ where: { id } });
  const result = await prisma.$transaction(async (transactionClient) => {
    if (patientHealthData) {
      if (patientHealthData.dateOfBirth) {
        patientHealthData.dateOfBirth = new Date(patientHealthData.dateOfBirth);
      }
      await transactionClient.patientHealthData.upsert({
        where: {
          patientId: id,
        },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: id },
      });
    }
    if (medicalReport) {
      await transactionClient.medicalReport.create({
        data: { ...medicalReport, patientId: id },
      });
    }
    const updatedPatient = await transactionClient.patient.update({
      where: {
        id,
      },
      data: remainingData,
      include: {
        patientHealthData: true,
        medicalReport: true,
      },
    });
    return updatedPatient;
  });
  return result;
};

const deletePatientFromDB = async (id: string): Promise<Patient | null> => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });
    await transactionClient.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });
    const patientDeletedData = await transactionClient.patient.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transactionClient.user.update({
      where: {
        email: patientDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return patientDeletedData;
  });
  return result;
};

export const patientServices = {
  getAllPatientsFromDB,
  getUniquePatientFromDB,
  updatePatientIntoDB,
  deletePatientFromDB,
};
