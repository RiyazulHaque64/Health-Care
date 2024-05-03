import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { PrescriptionControllers } from "./prescription.controller";

const router = Router();

router.get(
  "/my-prescription",
  auth(UserRole.PATIENT),
  PrescriptionControllers.patientPrescription
);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  PrescriptionControllers.createPrescription
);

export const PrescriptionRoutes = router;
