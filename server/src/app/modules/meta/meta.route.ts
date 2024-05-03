import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { MetaControllers } from "./meta.controller";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PATIENT, UserRole.DOCTOR),
  MetaControllers.fetchDashboardMetaData
);

export const MetaRoutes = router;
