import { z } from "zod";

import {
  BaseEntitySchema,
  BigIntIdSchema,
  CurrencyCodeSchema,
  MoneyMinorUnitSchema,
} from "@schemas/common";

export enum ReservationStatus {
  PENDING = 0,
  EXPIRED = 1,
  PAID = 2,
  CANCELLED = 3,
  PAYMENT_LOCKED = 4,
}

export const ReservationSchema = BaseEntitySchema.extend({
  reservationCode: z.string().max(32),
  userId: BigIntIdSchema,
  eventId: BigIntIdSchema,
  status: z.enum(ReservationStatus),
  lockedAt: z.iso.datetime(),
  expiresAt: z.iso.datetime(),
  paymentLockedAt: z.iso.datetime().nullable().optional(),
  paymentGraceUntil: z.iso.datetime().nullable().optional(),
  totalAmount: MoneyMinorUnitSchema,
  currency: CurrencyCodeSchema.optional(),
});

export const ReservationItemSchema = BaseEntitySchema.extend({
  reservationId: BigIntIdSchema,
  eventSeatId: BigIntIdSchema.nullable().optional(),
  ticketTypeId: BigIntIdSchema,
  quantity: z.number().int().min(1),
  unitPrice: MoneyMinorUnitSchema,
  subtotal: MoneyMinorUnitSchema,
  seatLabel: z.string().max(20).nullable().optional(),
  ticketName: z.string().max(255),
});

export type Reservation = z.infer<typeof ReservationSchema>;
export type ReservationItem = z.infer<typeof ReservationItemSchema>;
