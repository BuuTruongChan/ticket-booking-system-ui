import { z } from "zod";

import { BigIntIdSchema, SoftDeletableBaseEntitySchema } from "@schemas/common";

export const UserEntitySchema = SoftDeletableBaseEntitySchema.extend({
  id: BigIntIdSchema,
  email: z.string().email().max(255),
  phone: z.string().max(30).nullable().optional(),
  fullName: z.string().max(50),
  passwordHash: z.string().max(255),
});

export type UserEntity = z.infer<typeof UserEntitySchema>;
