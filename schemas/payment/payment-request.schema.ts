import { z } from "zod";

import { CorrelationIdSchema } from "@schemas/common";

export const CreateVNPayUrlRequestSchema = z.object({
  reservationId: z.string().min(1),
  eventId: z.string().min(1),
  waitRoomToken: z.string().min(1).optional(),
  correlationId: CorrelationIdSchema.optional(),
});

export const VNPayIpnQuerySchema = z.object({
  transactionId: z.string().min(1),
  reservationId: z.string().min(1),
  amount: z.coerce.number().nonnegative(),
  status: z.string().min(1),
});

export const VNPayReturnQuerySchema = z.object({
  transactionId: z.string().min(1),
  status: z.string().min(1),
  message: z.string().optional(),
});

export type CreateVNPayUrlRequest = z.infer<typeof CreateVNPayUrlRequestSchema>;
export type VNPayIpnQuery = z.infer<typeof VNPayIpnQuerySchema>;
export type VNPayReturnQuery = z.infer<typeof VNPayReturnQuerySchema>;
