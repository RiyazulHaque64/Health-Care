import { PaymentStatus, UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prisma";

const fetchDashboardMetaData = async (user: JwtPayload) => {
  let metaData;
  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      metaData = getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      metaData = getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      metaData = getDoctorMetaData(user);
      break;
    case UserRole.PATIENT:
      metaData = getPatientMetaData(user);
      break;

    default:
      throw new Error("Invalid User!");
  }
  return metaData;
};

const getSuperAdminMetaData = async () => {
  const adminCount = await prisma.admin.count();
  const doctorCount = await prisma.doctor.count();
  const patientCount = await prisma.patient.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });
  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return {
    adminCount,
    doctorCount,
    patientCount,
    paymentCount,
    totalRevenue: totalRevenue._sum.amount,
    barChartData,
    pieChartData,
  };
};

const getAdminMetaData = async () => {
  const doctorCount = await prisma.doctor.count();
  const patientCount = await prisma.patient.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return {
    doctorCount,
    patientCount,
    paymentCount,
    totalRevenue: totalRevenue._sum.amount,
    barChartData,
    pieChartData,
  };
};

const getDoctorMetaData = async (user: JwtPayload) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: {
      id: true,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
      status: PaymentStatus.PAID,
    },
    _sum: {
      amount: true,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      doctorId: doctorData.id,
    },
  });
  const formattedAppointmentDistribution = appointmentStatusDistribution.map(
    (count) => ({
      status: count.status,
      count: Number(count._count.id),
    })
  );

  return {
    appointmentCount,
    patientCount: patientCount.length,
    reviewCount,
    totalRevenue: totalRevenue._sum.amount,
    formattedAppointmentDistribution,
  };
};

const getPatientMetaData = async (user: JwtPayload) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });

  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patientData.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      patientId: patientData.id,
    },
  });
  const formattedAppointmentDistribution = appointmentStatusDistribution.map(
    (count) => ({
      status: count.status,
      count: Number(count._count.id),
    })
  );

  return {
    appointmentCount,
    prescriptionCount,
    reviewCount,
    formattedAppointmentDistribution,
  };
};

const getBarChartData = async () => {
  const appointmentCountByMonth = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createdAt") AS month,
    CAST(COUNT(*) AS INTEGER) AS count FROM "appointments"
    GROUP BY month
    ORDER BY month ASC
  `;
  return appointmentCountByMonth;
};

const getPieChartData = async () => {
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
  });
  const formattedAppointmentDistribution = appointmentStatusDistribution.map(
    (count) => ({
      status: count.status,
      count: Number(count._count.id),
    })
  );
  return formattedAppointmentDistribution;
};

export const MetaServices = {
  fetchDashboardMetaData,
};
