import { z } from "zod";
import {
  BaseEntitySchema,
  BigIntIdSchema,
  CurrencyCodeSchema,
  MoneyMinorUnitSchema,
} from "@schemas/common";

export enum PaymentTransactionType {
  PAYMENT = 0,
  REFUND = 1,
}

export enum PaymentMethod {
  CARD = 0,
  MOMO = 1,
  VNPAY = 2,
  BANK_TRANSFER = 3,
}

export enum PaymentStatus {
  INITIATED = 0,
  SUCCESS = 1,
  FAILED = 2,
  REFUNDED = 3,
}

export const PaymentTransactionSchema = BaseEntitySchema.extend({
  transactionCode: z.string().max(64),
  reservationId: BigIntIdSchema,
  userId: BigIntIdSchema.nullable().optional(),
  orderId: BigIntIdSchema.nullable().optional(),
  amount: MoneyMinorUnitSchema,
  currency: CurrencyCodeSchema,
  transactionType: z.enum(PaymentTransactionType),
  paymentMethod: z.enum(PaymentMethod),
  status: z.enum(PaymentStatus),
  gatewayResponse: z.record(z.string(), z.unknown()).nullable().optional(),
  initiatedAt: z.iso.datetime(),
  completedAt: z.iso.datetime().nullable().optional(),
  gatewayName: z.string().max(50),
  externalRefId: z.string().max(128),
});

export const VNPayTransactionStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "FAILED",
  "CANCELLED",
]);

export const CreateVNPayUrlResultSchema = z.object({
  paymentUrl: z.string().url(),
  reservationId: z.string(),
  amount: z.number(),
  currencyCode: z.string(),
});

export const VNPayIpnResponseSchema = z.object({
  success: z.boolean(),
  transactionId: z.string(),
  reservationId: z.string(),
  status: VNPayTransactionStatusSchema,
});

export const VNPayReturnResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  transactionId: z.string(),
});

export type CreateVNPayUrlResult = z.infer<typeof CreateVNPayUrlResultSchema>;
export type VNPayIpnResponse = z.infer<typeof VNPayIpnResponseSchema>;
export type VNPayReturnResponse = z.infer<typeof VNPayReturnResponseSchema>;
export type PaymentTransaction = z.infer<typeof PaymentTransactionSchema>;
