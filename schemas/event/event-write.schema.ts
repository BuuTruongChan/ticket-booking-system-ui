import { z } from "zod";

import { EventSchema } from "./event.schema";

export const EventWritableSchema = EventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  status: true,
  slug: true,
});

export const EventWritePatchSchema = EventWritableSchema.partial();

export type EventWritable = z.infer<typeof EventWritableSchema>;
export type EventWritePatch = z.infer<typeof EventWritePatchSchema>;
