import { PAGINATION } from "@/core/constants";
import { apiClient, parseOrThrow } from "@/lib/api";
import {
  OrganizerEventsPagedResult,
  OrganizerEventsPagedResultSchema,
  OrganizerEventsSearchParamsSchema,
  OrganizerEventsSearchParams,
} from "@schemas/catalog";
import {
  OrganizerEventTicketDetailResult,
  OrganizerEventTicketDetailResultSchema,
  OrganizerEventTicketsPagedResult,
  OrganizerEventTicketsPagedResultSchema,
  OrganizerEventTicketsQuery,
  OrganizerEventTicketsQuerySchema,
  OrganizerEventTicketSummaryResult,
  OrganizerEventTicketSummaryResultSchema,
  OrganizerValidateQrRequestSchema,
  OrganizerValidateQrResult,
  OrganizerValidateQrResultSchema,
  type OrganizerValidateQrRequest,
} from "@schemas/ticket";

export async function getOrganizerEvents({
  page = PAGINATION.DEFAULT_PAGE,
  limit = PAGINATION.DEFAULT_LIMIT,
  ...filters
}: Partial<OrganizerEventsSearchParams> = {}): Promise<OrganizerEventsPagedResult> {
  const parsedParams = OrganizerEventsSearchParamsSchema.parse({
    page,
    limit,
    ...filters,
  });

  const response = await apiClient.get("/search/organizer/events", {
    params: parsedParams,
  });

  return parseOrThrow(OrganizerEventsPagedResultSchema, response);
}

export async function getOrganizerEventTicketSummary(
  eventId: string,
): Promise<OrganizerEventTicketSummaryResult> {
  const response = await apiClient.get(`/organizer/events/${eventId}/summary`);
  return parseOrThrow(OrganizerEventTicketSummaryResultSchema, response);
}

export async function getOrganizerEventTickets(
  eventId: string,
  query: Partial<OrganizerEventTicketsQuery> = {},
): Promise<OrganizerEventTicketsPagedResult> {
  const parsedQuery = OrganizerEventTicketsQuerySchema.parse(query);
  const response = await apiClient.get(`/organizer/events/${eventId}/tickets`, {
    params: parsedQuery,
  });

  return parseOrThrow(OrganizerEventTicketsPagedResultSchema, response);
}

export async function getOrganizerEventTicketDetail(
  eventId: string,
  ticketId: string,
): Promise<OrganizerEventTicketDetailResult> {
  const response = await apiClient.get(
    `/organizer/events/${eventId}/tickets/${ticketId}`,
  );

  return parseOrThrow(OrganizerEventTicketDetailResultSchema, response);
}

export async function validateOrganizerTicketQr(
  eventId: string,
  payload: OrganizerValidateQrRequest,
): Promise<OrganizerValidateQrResult> {
  const parsedPayload = OrganizerValidateQrRequestSchema.parse(payload);
  const response = await apiClient.post(
    `/organizer/events/${eventId}/tickets/validate-qr`,
    parsedPayload,
  );

  return parseOrThrow(OrganizerValidateQrResultSchema, response);
}
