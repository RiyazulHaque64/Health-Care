import { Router } from "express";
import { adminRoutes } from "../modules/admin/admin.routes";
import { appointmentRoutes } from "../modules/appointment/appointment.route";
import { authRoutes } from "../modules/auth/auth.routes";
import { doctorRoutes } from "../modules/doctor/doctor.route";
import { doctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.route";
import { MetaRoutes } from "../modules/meta/meta.route";
import { patientRoutes } from "../modules/patient/patient.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { PrescriptionRoutes } from "../modules/prescription/prescription.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { scheduleRoutes } from "../modules/schedule/schedule.route";
import { SpecialitiesRoutes } from "../modules/specialities/specialities.route";
import { userRoutes } from "../modules/user/user.routes";

const router = Router();

const routes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/doctor",
    route: doctorRoutes,
  },
  {
    path: "/patient",
    route: patientRoutes,
  },
  {
    path: "/specialities",
    route: SpecialitiesRoutes,
  },
  {
    path: "/schedule",
    route: scheduleRoutes,
  },
  {
    path: "/doctor-schedule",
    route: doctorScheduleRoutes,
  },
  {
    path: "/appointment",
    route: appointmentRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/prescription",
    route: PrescriptionRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
  {
    path: "/meta",
    route: MetaRoutes,
  },
];
routes.forEach((route) => router.use(route.path, route.route));

export default router;
