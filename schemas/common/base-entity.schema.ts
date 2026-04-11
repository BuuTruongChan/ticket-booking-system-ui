import { z } from "zod";

import { BigIntIdSchema } from "./bigint-id.schema";

export const BaseEntitySchema = z.object({
  id: BigIntIdSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const SoftDeletableBaseEntitySchema = BaseEntitySchema.extend({
  deletedAt: z.iso.datetime().nullable(),
});

// Monetary values are stored by backend in smallest currency unit (bigint).
export const MoneyMinorUnitSchema = z.coerce.string().regex(/^\d+$/, {
  message:
    "Monetary amount must be an integer string in smallest currency unit",
});

export const CurrencyCodeSchema = z.string().length(3).toUpperCase();
