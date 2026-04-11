import { z } from "zod";

export const BigIntIdSchema = z.coerce.string().regex(/^\d+$/, {
  message: "BigInt id must contain only digits",
});
