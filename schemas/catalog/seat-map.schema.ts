import { z } from "zod";

import { VenueSeatSchema } from "./catalog.schema";

export const EventSeatRowSchema = z.object({
  rowId: z.string(),
  rowLabel: z.string(),
  seats: z.array(VenueSeatSchema),
});

export const EventSeatSectionSchema = z.object({
  sectionId: z.string(),
  sectionName: z.string(),
  rows: z.array(EventSeatRowSchema),
});

export const EventSeatMapSchema = z.object({
  eventId: z.string(),
  sections: z.array(EventSeatSectionSchema),
});

export const BestAvailableSeatSchema = z.object({
  seatId: z.string(),
  seatLabel: z.string(),
  section: z.string(),
  row: z.string(),
  price: z.number(),
});

export type EventSeatMap = z.infer<typeof EventSeatMapSchema>;
export type BestAvailableSeat = z.infer<typeof BestAvailableSeatSchema>;
