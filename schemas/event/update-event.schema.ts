import { z } from "zod";

import { validateEventSaleWindow } from "./event-sale-window.rule";
import { EventWritePatchSchema } from "./event-write.schema";

export const UpdateEventSchema = EventWritePatchSchema.superRefine(
  (data, ctx) => {
    validateEventSaleWindow(data, ctx);
  },
);

export type UpdateEventDTO = z.infer<typeof UpdateEventSchema>;
