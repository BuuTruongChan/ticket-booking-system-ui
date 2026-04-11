import { PAGINATION } from "@/core/constants";
import { apiClient, parseOrThrow } from "@/lib/api";
import {
  EventDetailResult,
  EventDetailResultSchema,
  EventPagedListResult,
  EventPagedListResultSchema,
  GetEventsParams,
} from "@schemas/event";

export async function getCatalogEvents({
  page = PAGINATION.DEFAULT_PAGE,
  limit = PAGINATION.DEFAULT_LIMIT,
  ...filters
}: {
  page?: number;
  limit?: number;
} & Partial<GetEventsParams> = {}): Promise<EventPagedListResult> {
  const response = await apiClient.get("/catalog/events", {
    params: { page, limit, ...filters },
  });

  return parseOrThrow(EventPagedListResultSchema, response);
}

export async function getCatalogEventDetail(
  eventIdentifier: string,
): Promise<EventDetailResult> {
  const response = await apiClient.get(`/catalog/events/${eventIdentifier}`);
  return parseOrThrow(EventDetailResultSchema, response);
}
