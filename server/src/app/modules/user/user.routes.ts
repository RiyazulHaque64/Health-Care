import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { fileUploader } from "../../helper/fileUploader";
import auth from "../../middlewares/auth";
import { userControllers } from "./user.controller";
import { userValidations } from "./user.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userControllers.getAllUser
);

router.get(
  "/me",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  userControllers.getProfile
);

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createUserValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    next();
  },
  userControllers.createUser
);

router.post(
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createDoctorValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    next();
  },
  userControllers.createDoctor
);

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createPatientValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    next();
  },
  userControllers.createPatient
);

router.patch(
  "/update-my-profile",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  userControllers.updateMyProfile
);

router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userControllers.changeProfileStatus
);

export const userRoutes = router;
