import { z } from "zod";
import { identifier, requiredString, longText } from "../../shared/validators/string";
import { positiveNumber } from "../../shared/validators/number";

export const productParamsSchema = z.object({
  id: identifier("Product id"),
});

export const productBodySchema = z.object({
  name: requiredString("Name", { max: 200 }),
  price: positiveNumber("Price"),
  description: longText("Description"),
  category: requiredString("Category", { max: 100 }),
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
