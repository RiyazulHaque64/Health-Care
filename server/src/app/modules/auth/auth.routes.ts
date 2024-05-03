import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { authControllers } from "./auth.controller";

const router = Router();

router.post("/login", authControllers.loginUser);
router.post("/access-token", authControllers.getAccessToken);
router.post(
  "/change-password",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  authControllers.changePassword
);
router.post("/forgot-password", authControllers.forgotPassword);
router.post("/reset-password", authControllers.resetPassword);

export const authRoutes = router;
