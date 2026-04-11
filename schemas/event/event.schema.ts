import { z } from "zod";
import { BigIntIdSchema, SoftDeletableBaseEntitySchema } from "@schemas/common";

export const EventStatus = {
  DRAFT: "DRAFT",
  UPCOMING: "UPCOMING",
  ON_SALE: "ON_SALE",
  SOLD_OUT: "SOLD_OUT",
  FINISHED: "FINISHED",
  CANCELLED: "CANCELLED",
} as const;

export const EventStatusSchema = z.enum(EventStatus);
export type EventStatus = z.infer<typeof EventStatusSchema>;

export const EventSchema = SoftDeletableBaseEntitySchema.extend({
  id: BigIntIdSchema,
  eventCode: z.string().max(32),
  eventName: z.string().max(255),
  desc: z.string().nullable().optional(),
  venue: z.string().max(255),
  venueId: BigIntIdSchema.nullable().optional(),
  organizerId: BigIntIdSchema.nullable().optional(),

  eventDate: z.iso.datetime(),
  saleStartDate: z.iso.datetime(),
  saleEndDate: z.iso.datetime(),
  lobbyStartDate: z.iso.datetime().nullable().optional(),

  status: EventStatusSchema,
  slug: z.string().min(1),
});

export type Event = z.infer<typeof EventSchema>;
