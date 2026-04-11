import { z } from "zod";
import { PAGINATION } from "@/core/constants";
import {
  ApiPagedEnvelopeSchema,
  DateRangeQuerySchema,
  PaginationQuerySchema,
} from "@schemas/common";
import { EventStatusSchema } from "@schemas/event";

export const SearchEventItemSchema = z.object({
  id: z.string(),
  eventCode: z.string(),
  eventName: z.string(),
  eventDate: z.iso.datetime(),
  venue: z.string(),
  city: z.string(),
  minPrice: z.number(),
  maxPrice: z.number(),
  imageUrl: z.string().url().nullable().optional(),
  slug: z.string(),
});

export const SearchSuggestionCategorySchema = z.enum([
  "event_name",
  "venue_name",
  "city_name",
]);

export const SearchSuggestionItemSchema = z.object({
  text: z.string(),
  category: SearchSuggestionCategorySchema,
});

const OrganizerEventPaginationQuerySchema = PaginationQuerySchema.extend({
  page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(PAGINATION.MIN_LIMIT)
    .max(100)
    .default(PAGINATION.DEFAULT_LIMIT),
});

export const OrganizerEventsSearchParamsSchema =
  OrganizerEventPaginationQuerySchema.merge(DateRangeQuerySchema).extend({
    q: z.string().trim().min(1).optional(),
    status: EventStatusSchema.optional(),
  });

export const OrganizerEventsPagedResultSchema = ApiPagedEnvelopeSchema(
  SearchEventItemSchema,
);

export type SearchEventItem = z.infer<typeof SearchEventItemSchema>;
export type SearchSuggestionItem = z.infer<typeof SearchSuggestionItemSchema>;
export type OrganizerEventsSearchParams = z.infer<
  typeof OrganizerEventsSearchParamsSchema
>;
export type OrganizerEventsPagedResult = z.infer<
  typeof OrganizerEventsPagedResultSchema
>;
