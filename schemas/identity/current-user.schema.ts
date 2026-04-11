import { z } from "zod";

import { ApiContractEnvelopeSchema } from "@schemas/common";

export const CurrentUserRoleSchema = z.enum([
  "USER",
  "ORGANIZER",
  "ADMIN",
  "SUPER_ADMIN",
]);

export const CurrentUserSchema = z.object({
  id: z.string().min(1),
  role: CurrentUserRoleSchema,
});

export const IdentityMeDataSchema = z.object({
  msg: z.string(),
  user: CurrentUserSchema,
});

export const IdentityMeResponseSchema =
  ApiContractEnvelopeSchema(IdentityMeDataSchema);

export type CurrentUser = z.infer<typeof CurrentUserSchema>;
export type IdentityMeData = z.infer<typeof IdentityMeDataSchema>;
export type IdentityMeResponse = z.infer<typeof IdentityMeResponseSchema>;
