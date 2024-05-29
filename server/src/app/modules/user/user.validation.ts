import { Gender } from "@prisma/client";
import { z } from "zod";

const createUserValidationSchema = z.object({
  password: z.string({ required_error: "Password is required" }),
  admin: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please give a valid email" }),
    contactNumber: z.string({ required_error: "Contact number is required" }),
  }),
});

const createDoctorValidationSchema = z.object({
  password: z.string({ required_error: "Password is required" }),
  doctor: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please type a valid email" }),
    contactNumber: z.string({ required_error: "Contact number is required" }),
    address: z.string().optional(),
    registrationNumber: z.string({
      required_error: "Registration number is required",
    }),
    experience: z.number().int().default(0),
    gender: z.enum([Gender.MALE, Gender.FEMALE]),
    appointmentFee: z
      .number({ required_error: "Appointment fee is required" })
      .int(),
    qualification: z.string({ required_error: "Qualification is required" }),
    currentWorkingPlace: z.string({
      required_error: "Current working place is required",
    }),
    designation: z.string({ required_error: "Designation is required" }),
    averageRating: z.number().optional(),
  }),
});

const createPatientValidationSchema = z.object({
  password: z.string({ required_error: "Password is required" }),
  patient: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please type a valid email" }),
    contactNumber: z.string({ required_error: "Contact number is required" }),
    address: z.string().optional(),
  }),
});

export const userValidations = {
  createUserValidationSchema,
  createDoctorValidationSchema,
  createPatientValidationSchema,
};
