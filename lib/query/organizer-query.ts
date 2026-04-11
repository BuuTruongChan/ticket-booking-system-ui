import { PAGINATION } from "@/core/constants";
import {
  EventStatus,
  type EventStatus as EventStatusValue,
} from "@schemas/event";

type SearchParamsReader = {
  get(name: string): string | null;
  toString(): string;
};

export type OrganizerQueryState = {
  page: number;
  limit: number;
  q: string;
  status: EventStatusValue | "";
  eventId: string;
  eventCode: string;
};

const EVENT_STATUS_VALUES = new Set<string>(Object.values(EventStatus));
const PAGINATION_LIMIT_OPTIONS: number[] = [...PAGINATION.LIMIT_OPTIONS];

export const ORGANIZER_STATUS_OPTIONS = Object.values(EventStatus).map(
  (status) => ({
    value: status,
    label: status.replaceAll("_", " "),
  }),
);

function parsePage(value: string | null): number {
  const parsed = Number(value ?? PAGINATION.DEFAULT_PAGE);
  return Number.isFinite(parsed) && parsed >= 1
    ? parsed
    : PAGINATION.DEFAULT_PAGE;
}

function parseLimit(value: string | null): number {
  const parsed = Number(value ?? PAGINATION.DEFAULT_LIMIT);
  if (!Number.isFinite(parsed)) {
    return PAGINATION.DEFAULT_LIMIT;
  }

  return PAGINATION_LIMIT_OPTIONS.includes(parsed)
    ? parsed
    : PAGINATION.DEFAULT_LIMIT;
}

function parseStatus(value: string | null): EventStatusValue | "" {
  if (!value) {
    return "";
  }

  return EVENT_STATUS_VALUES.has(value) ? (value as EventStatusValue) : "";
}

export function readOrganizerQueryState(
  searchParams: SearchParamsReader,
): OrganizerQueryState {
  return {
    page: parsePage(searchParams.get("page")),
    limit: parseLimit(searchParams.get("limit")),
    q: searchParams.get("q") ?? "",
    status: parseStatus(searchParams.get("status")),
    eventId: searchParams.get("eventId") ?? "",
    eventCode: searchParams.get("eventCode") ?? "",
  };
}

export function buildOrganizerQueryString(state: OrganizerQueryState): string {
  const params = new URLSearchParams();

  params.set("page", String(state.page));
  params.set("limit", String(state.limit));

  if (state.q.trim()) {
    params.set("q", state.q.trim());
  }

  if (state.status) {
    params.set("status", state.status);
  }

  if (state.eventId.trim()) {
    params.set("eventId", state.eventId.trim());
  }

  if (state.eventCode.trim()) {
    params.set("eventCode", state.eventCode.trim());
  }

  return params.toString();
}

export function withOrganizerQuery(
  path: string,
  state: OrganizerQueryState,
): string {
  const queryString = buildOrganizerQueryString(state);
  return queryString ? `${path}?${queryString}` : path;
}

export function mergeSearchParams(
  searchParams: SearchParamsReader,
  next: Record<string, string | number | null>,
): string {
  const params = new URLSearchParams(searchParams.toString());

  Object.entries(next).forEach(([key, value]) => {
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

export function getBoundedPageJump(
  rawValue: string,
  currentPage: number,
  totalPages: number,
): number {
  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed)) {
    return currentPage;
  }

  return Math.min(totalPages, Math.max(1, Math.floor(parsed)));
}
