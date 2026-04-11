import { z } from "zod";

import {
  ApiContractEnvelopeSchema,
  ApiPagedEnvelopeSchema,
} from "@schemas/common";
import { EventSchema } from "./event.schema";

export const EventListResultSchema = ApiContractEnvelopeSchema(
  z.array(EventSchema),
);
export type EventListResult = z.infer<typeof EventListResultSchema>;

export const EventPagedListResultSchema = ApiPagedEnvelopeSchema(EventSchema);
export type EventPagedListResult = z.infer<typeof EventPagedListResultSchema>;

export const EventDetailResultSchema = ApiContractEnvelopeSchema(EventSchema);
export type EventDetailResult = z.infer<typeof EventDetailResultSchema>;
