import { ZodSchema } from "zod";
import { BadRequestException } from "@nestjs/common";

export const validateWithSchema = <T>(
  schema: ZodSchema<T>,
  inputData: unknown
): T => {
  const result = schema.safeParse(inputData);

  if (!result.success) {
    throw new BadRequestException(result.error.errors);
  }

  return result.data;
};
