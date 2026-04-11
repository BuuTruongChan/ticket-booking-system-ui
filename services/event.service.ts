import { PAGINATION } from "@/core/constants";
import { apiClient, parseOrThrow } from "@/lib/api";
import {
  getCatalogEventDetail,
  getCatalogEvents,
} from "@/services/catalog.service";
import {
  CreateEventDTO,
  EventDetailResult,
  EventDetailResultSchema,
  EventPagedListResult,
  GetEventsParams,
  UpdateEventDTO,
} from "@schemas/event";

export const getEvents = async ({
  page = PAGINATION.DEFAULT_PAGE,
  limit = PAGINATION.DEFAULT_LIMIT,
  ...filters
}: GetEventsParams): Promise<EventPagedListResult> => {
  return getCatalogEvents({ page, limit, ...filters });
};

export const getEventDetail = async (
  eventIdentifier: string,
): Promise<EventDetailResult> => {
  return getCatalogEventDetail(eventIdentifier);
};

export const createEvent = async (
  payload: CreateEventDTO,
): Promise<EventDetailResult> => {
  const response = await apiClient.post("/catalog/events", payload);
  return parseOrThrow(EventDetailResultSchema, response);
};

export const updateEvent = async (
  eventCode: string,
  payload: UpdateEventDTO,
): Promise<EventDetailResult> => {
  const response = await apiClient.patch(
    `/catalog/events/${eventCode}`,
    payload,
  );
  return parseOrThrow(EventDetailResultSchema, response);
};
