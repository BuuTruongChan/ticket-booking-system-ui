import { z } from "zod";

import { validateEventSaleWindow } from "./event-sale-window.rule";
import { EventWritableSchema } from "./event-write.schema";

export const CreateEventSchema = EventWritableSchema.superRefine(
  (data, ctx) => {
    validateEventSaleWindow(data, ctx);
  },
);

export type CreateEventDTO = z.infer<typeof CreateEventSchema>;
