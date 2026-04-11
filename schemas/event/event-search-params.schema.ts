import { PAGINATION } from "@/core/constants";
import { z } from "zod";
import { DateRangeQuerySchema, PaginationQuerySchema } from "@schemas/common";

import { EventStatus } from "./event.schema";

const EventPaginationQuerySchema = PaginationQuerySchema.extend({
  page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(PAGINATION.MIN_LIMIT)
    .max(100)
    .default(PAGINATION.DEFAULT_LIMIT),
});

export const GetEventsParamsSchema = EventPaginationQuerySchema.merge(
  DateRangeQuerySchema,
).extend({
  search: z.string().trim().min(1).optional(),
  status: z.enum(EventStatus).optional(),
});

export type GetEventsParams = z.infer<typeof GetEventsParamsSchema>;
