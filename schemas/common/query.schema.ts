import { z } from "zod";

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const DateRangeQuerySchema = z.object({
  dateFrom: z.iso.datetime().optional(),
  dateTo: z.iso.datetime().optional(),
});

export const CorrelationIdSchema = z.string().min(1).max(128);

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type DateRangeQuery = z.infer<typeof DateRangeQuerySchema>;
