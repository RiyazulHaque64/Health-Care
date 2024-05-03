import { Router } from "express";
import { PaymentControllers } from "./payment.controller";

const router = Router();

router.get("/ipn", PaymentControllers.validatePayment);
router.post("/init-payment/:appointmentId", PaymentControllers.initPayment);

export const PaymentRoutes = router;
