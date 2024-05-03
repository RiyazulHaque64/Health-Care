import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { doctorScheduleControllers } from "./doctorSchedule.controller";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorScheduleControllers.getAllDoctorSchedules
);

router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  doctorScheduleControllers.getMySchedules
);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  doctorScheduleControllers.bookDoctorSchedules
);

router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  doctorScheduleControllers.deleteMySchedule
);

export const doctorScheduleRoutes = router;
