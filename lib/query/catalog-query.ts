import { PAGINATION } from "@/core/constants";
import {
  EventStatus,
  type EventStatus as EventStatusValue,
} from "@schemas/event";

type SearchParamsReader = {
  get(name: string): string | null;
};

export type CatalogQueryState = {
  page: number;
  limit: number;
  search: string;
  status: EventStatusValue | "";
  dateFrom: string;
  dateTo: string;
};

const EVENT_STATUS_VALUES = new Set<string>(Object.values(EventStatus));
const PAGINATION_LIMIT_OPTIONS: number[] = [...PAGINATION.LIMIT_OPTIONS];

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

function normalizeTrimmed(value: string | null): string {
  return value?.trim() ?? "";
}

function normalizeDateRange(
  dateFrom: string,
  dateTo: string,
): Pick<CatalogQueryState, "dateFrom" | "dateTo"> {
  if (!dateFrom || !dateTo) {
    return { dateFrom, dateTo };
  }

  return dateFrom <= dateTo
    ? { dateFrom, dateTo }
    : { dateFrom: dateTo, dateTo: dateFrom };
}

export function readCatalogQueryState(
  searchParams: SearchParamsReader,
): CatalogQueryState {
  const search = normalizeTrimmed(searchParams.get("search"));
  const dateFrom = normalizeTrimmed(searchParams.get("dateFrom"));
  const dateTo = normalizeTrimmed(searchParams.get("dateTo"));
  const normalizedRange = normalizeDateRange(dateFrom, dateTo);

  return {
    page: parsePage(searchParams.get("page")),
    limit: parseLimit(searchParams.get("limit")),
    search,
    status: parseStatus(searchParams.get("status")),
    dateFrom: normalizedRange.dateFrom,
    dateTo: normalizedRange.dateTo,
  };
}

export function buildCatalogQueryString(state: CatalogQueryState): string {
  const params = new URLSearchParams();

  if (state.page !== PAGINATION.DEFAULT_PAGE) {
    params.set("page", String(state.page));
  }

  if (state.limit !== PAGINATION.DEFAULT_LIMIT) {
    params.set("limit", String(state.limit));
  }

  if (state.search.trim()) {
    params.set("search", state.search.trim());
  }

  if (state.status) {
    params.set("status", state.status);
  }

  if (state.dateFrom.trim()) {
    params.set("dateFrom", state.dateFrom.trim());
  }

  if (state.dateTo.trim()) {
    params.set("dateTo", state.dateTo.trim());
  }

  return params.toString();
}

export function withCatalogQuery(
  path: string,
  state: CatalogQueryState,
): string {
  const queryString = buildCatalogQueryString(state);
  return queryString ? `${path}?${queryString}` : path;
}
