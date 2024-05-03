import { PaymentStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import { SSLServices } from "../SSL/ssl.service";

const initPayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findUniqueOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  const sslPaymentData = {
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    name: paymentData.appointment.patient.name,
    email: paymentData.appointment.patient.email,
    contactNumber: paymentData.appointment.patient.contactNumber,
    address: paymentData.appointment.patient.address,
  };

  const result = await SSLServices.initPaymentInSSL(sslPaymentData);

  return {
    paymentUrl: result.GatewayPageURL,
  };
};

const validatePayment = async (query: any) => {
  //   if (!query || !query.status || !(query.status === "VALID")) {
  //     return {
  //       message: "Invalid payment!",
  //     };
  //   }

  //   const validatePayment = await SSLServices.validatePaymentFromSSL(query);

  const validatePayment = query;
  console.log(query);

  await prisma.$transaction(async (transactionClient) => {
    const paymentData = await transactionClient.payment.update({
      where: {
        transactionId: validatePayment.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: validatePayment,
      },
    });
    console.log(paymentData);
    await transactionClient.appointment.update({
      where: {
        id: paymentData.appointmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });
  return {
    message: "Payment success!",
  };
};

export const PaymentServices = {
  initPayment,
  validatePayment,
};
