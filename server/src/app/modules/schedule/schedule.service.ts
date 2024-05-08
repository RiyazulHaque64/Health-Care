import { Prisma, Schedule } from "@prisma/client";
import { addDays, addHours, addMinutes, format } from "date-fns";
import { JwtPayload } from "jsonwebtoken";
import pagination from "../../helper/pagination";
import prisma from "../../shared/prisma";
import { TScheduleInput } from "./schedule.interface";

const converTimeToUTC = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  const convertedTime = new Date(date.getTime() + offset);
  return convertedTime;
};

const createScheduleIntoDB = async (
  data: TScheduleInput
): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = data;
  let firstDate = new Date(startDate);
  const lastDate = new Date(endDate);
  const intervalTime = 30;
  const schedules = [];

  while (firstDate <= lastDate) {
    let startTimeOfTheDay = new Date(
      addMinutes(
        addHours(
          format(firstDate, "yyyy-MM-dd"),
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    const endTimeOfTheDay = new Date(
      addMinutes(
        addHours(
          format(firstDate, "yyyy-MM-dd"),
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );
    while (startTimeOfTheDay < endTimeOfTheDay) {
      const schedule = {
        startDateTime: converTimeToUTC(startTimeOfTheDay),
        endDateTime: converTimeToUTC(
          addMinutes(startTimeOfTheDay, intervalTime)
        ),
      };
      startTimeOfTheDay = addMinutes(startTimeOfTheDay, intervalTime);
      const isExistsSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: schedule.startDateTime,
          endDateTime: schedule.endDateTime,
        },
      });
      if (!isExistsSchedule) {
        const result = await prisma.schedule.create({
          data: schedule,
        });
        schedules.push(result);
      }
    }
    firstDate = addDays(firstDate, 1);
  }
  return schedules;
};

const getAllSchedulesFromDB = async (user: JwtPayload, query: any) => {
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
  const { pageNumber, limitNumber, skip, sortWith, orderBy } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
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

  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user.email,
      },
    },
  });
  const scheduleIds = doctorSchedules.map((schedule) => schedule.scheduleId);

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: scheduleIds,
      },
    },
    skip: skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: orderBy,
    },
  });

  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: scheduleIds,
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

export const scheduleServices = {
  createScheduleIntoDB,
  getAllSchedulesFromDB,
};
