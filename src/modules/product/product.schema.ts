import { z } from "zod";
import { requiredString } from "../../shared/validators/string";
import { positiveNumber } from "../../shared/validators/number";

export const productParamsSchema = z.object({
  id: requiredString("Product id"),
});

export const productBodySchema = z.object({
  name: requiredString("Name"),
  price: positiveNumber("Price"),
  description: requiredString("Description"),
  category: requiredString("Category"),
});

export const productResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  active: z.boolean(),
});

export const productListResponseSchema = z.array(productResponseSchema);

export type ProductParams = z.infer<typeof productParamsSchema>;
export type ProductBody = z.infer<typeof productBodySchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
