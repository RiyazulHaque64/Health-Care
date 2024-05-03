import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { fileUploader } from "../../helper/fileUploader";
import auth from "../../middlewares/auth";
import { SpecialitiesControllers } from "./specialities.controller";
import { SpecialitiesValidations } from "./specialities.validation";

const router = Router();

router.get("/", SpecialitiesControllers.getAllSpecialities);

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialitiesValidations.insertSpecialitiesValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    next();
  },
  SpecialitiesControllers.insertSpecialities
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SpecialitiesControllers.deleteSpecialities
);

export const SpecialitiesRoutes = router;
