import { z } from "zod";

export const positiveInt = (field: string) =>
  z
    .number({ error: `${field} is required` })
    .int({ message: `${field} must be an integer` })
    .min(1, { message: `${field} must be greater than 0` });
