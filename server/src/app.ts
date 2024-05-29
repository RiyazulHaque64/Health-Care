import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import cron from "node-cron";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import { AppointmentServices } from "./app/modules/appointment/appointment.service";
import router from "./app/routes";

const app: Application = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Server is working fine",
  });
});

app.use("/api/v1", router);

cron.schedule("* * * * *", () => {
  try {
    AppointmentServices.cancelUnpaidAppointments();
  } catch (error) {
    console.log(error);
  }
});

app.use(globalErrorHandler);

app.use(notFoundHandler);

export default app;
