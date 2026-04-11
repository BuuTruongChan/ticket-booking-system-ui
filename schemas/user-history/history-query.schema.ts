import { z } from "zod";

import { DateRangeQuerySchema, PaginationQuerySchema } from "@schemas/common";

const HistoryBaseQuerySchema = PaginationQuerySchema.merge(
  DateRangeQuerySchema,
).extend({
  eventId: z.string().optional(),
});

export const UserOrderHistoryQuerySchema = HistoryBaseQuerySchema.extend({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
});

export const UserPaymentHistoryQuerySchema = HistoryBaseQuerySchema.extend({
  status: z.enum(["PENDING", "PAID", "FAILED"]).optional(),
  paymentMethod: z.enum(["VNPAY"]).optional(),
});

export type UserOrderHistoryQuery = z.infer<typeof UserOrderHistoryQuerySchema>;
export type UserPaymentHistoryQuery = z.infer<
  typeof UserPaymentHistoryQuerySchema
>;
