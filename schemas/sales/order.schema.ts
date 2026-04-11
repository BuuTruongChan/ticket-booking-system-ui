import { z } from "zod";

import {
  BaseEntitySchema,
  BigIntIdSchema,
  MoneyMinorUnitSchema,
} from "@schemas/common";

export enum OrderStatus {
  PENDING = 0,
  CONFIRMED = 1,
  CANCELLED = 2,
  REFUNDED = 3,
}

export const OrderSchema = BaseEntitySchema.extend({
  orderNumber: z.string().max(64),
  userId: BigIntIdSchema,
  eventId: BigIntIdSchema,
  reservationId: BigIntIdSchema,
  totalAmount: MoneyMinorUnitSchema,
  status: z.enum(OrderStatus),
  confirmedAt: z.iso.datetime().nullable().optional(),
});

export const OrderItemSchema = BaseEntitySchema.extend({
  orderId: BigIntIdSchema,
  ticketTypeId: BigIntIdSchema,
  quantity: z.number().int().min(1),
  unitPrice: MoneyMinorUnitSchema,
  subtotal: MoneyMinorUnitSchema,
  ticketName: z.string().max(255),
});

export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
