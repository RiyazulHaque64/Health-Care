import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { ReviewControllers } from "./review.controller";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ReviewControllers.getAllReviews
);

router.post("/", auth(UserRole.PATIENT), ReviewControllers.createReview);

export const ReviewRoutes = router;
