import { z } from "zod";

const insertSpecialitiesValidationSchema = z.object({
  title: z.string({ required_error: "Specialities title is required" }),
});

export const SpecialitiesValidations = {
  insertSpecialitiesValidationSchema,
};
