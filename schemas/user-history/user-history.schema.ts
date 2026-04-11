import { z } from "zod";
import { MoneyMinorUnitSchema } from "@schemas/common";

export const UserOrderHistoryStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
]);

export const UserOrderHistoryItemSchema = z.object({
  orderId: z.string(),
  eventId: z.string(),
  eventName: z.string(),
  ticketCount: z.number().int(),
  totalPrice: MoneyMinorUnitSchema,
  status: UserOrderHistoryStatusSchema,
  createdAt: z.iso.datetime(),
});

export const UserPaymentHistoryStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "FAILED",
]);

export const UserPaymentMethodSchema = z.enum(["VNPAY"]);

export const UserPaymentHistoryItemSchema = z.object({
  transactionId: z.string(),
  orderId: z.string(),
  amount: MoneyMinorUnitSchema,
  status: UserPaymentHistoryStatusSchema,
  paymentMethod: UserPaymentMethodSchema,
  createdAt: z.iso.datetime(),
  paidAt: z.iso.datetime().nullable().optional(),
});

export type UserOrderHistoryItem = z.infer<typeof UserOrderHistoryItemSchema>;
export type UserPaymentHistoryItem = z.infer<
  typeof UserPaymentHistoryItemSchema
>;
