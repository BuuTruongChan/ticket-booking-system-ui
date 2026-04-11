"use client";

import { type ComponentProps, useCallback, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { CatalogEventGrid } from "@/components/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PAGINATION } from "@/core/constants";
import { UI_MESSAGES } from "@/core/messages";
import { useCatalogEvents } from "@/hooks/catalog";
import { useCurrentUserOrGuest } from "@/hooks/user";
import {
  getBoundedPageJump,
  mergeSearchParams,
  readCatalogQueryState,
  toURLSearchParams,
} from "@/lib/query";
import {
  EventStatus,
  type EventStatus as EventStatusValue,
} from "@schemas/event";

type CatalogHomePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

type FormSubmitEvent = Parameters<
  NonNullable<ComponentProps<"form">["onSubmit"]>
>[0];

const EVENT_STATUS_OPTIONS: Array<{
  value: EventStatusValue | "";
  label: string;
}> = [
  { value: "", label: "All statuses" },
  ...Object.values(EventStatus).map((status) => ({
    value: status,
    label: status.replaceAll("_", " "),
  })),
];

const SEARCH_SYNC_DEBOUNCE_MS = 400;

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDatePresetRange(preset: "today" | "week" | "month"): {
  dateFrom: string;
  dateTo: string;
} {
  const now = new Date();

  if (preset === "today") {
    const value = formatDateForInput(now);
    return { dateFrom: value, dateTo: value };
  }

  if (preset === "week") {
    const start = new Date(now);
    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + mondayOffset);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return {
      dateFrom: formatDateForInput(start),
      dateTo: formatDateForInput(end),
    };
  }

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    dateFrom: formatDateForInput(start),
    dateTo: formatDateForInput(end),
  };
}

export function CatalogHomePage({ searchParams = {} }: CatalogHomePageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user } = useCurrentUserOrGuest();

  const urlParams = useMemo(
    () => toURLSearchParams(searchParams),
    [searchParams],
  );
  const catalogQueryState = useMemo(
    () => readCatalogQueryState(urlParams),
    [urlParams],
  );

  const { data, isLoading, isError, refetch, isFetching } =
    useCatalogEvents(catalogQueryState);
  const catalogErrorCopy = UI_MESSAGES.CATALOG;
  const commonCopy = UI_MESSAGES.COMMON;

  const catalogFormKey = urlParams.toString();
  const searchDebounceRef = useRef<number | null>(null);

  const replaceSearchParams = useCallback(
    (next: Record<string, string | number | null>) => {
      const queryString = mergeSearchParams(urlParams, next);
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, urlParams],
  );

  const handleSearchInputChange = useCallback(
    (value: string) => {
      if (searchDebounceRef.current) {
        window.clearTimeout(searchDebounceRef.current);
      }

      searchDebounceRef.current = window.setTimeout(() => {
        const trimmedSearch = value.trim();
        if (trimmedSearch === catalogQueryState.search) {
          return;
        }

        replaceSearchParams({
          search: trimmedSearch || null,
          status: catalogQueryState.status || null,
          dateFrom: catalogQueryState.dateFrom || null,
          dateTo: catalogQueryState.dateTo || null,
          page: PAGINATION.DEFAULT_PAGE,
          limit: catalogQueryState.limit,
        });
      }, SEARCH_SYNC_DEBOUNCE_MS);
    },
    [
      catalogQueryState.dateFrom,
      catalogQueryState.dateTo,
      catalogQueryState.limit,
      catalogQueryState.search,
      catalogQueryState.status,
      replaceSearchParams,
    ],
  );

  function handleFilterSubmit(event: FormSubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextLimit = Number(formData.get("limit") ?? catalogQueryState.limit);
    const search = String(formData.get("search") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();
    const dateFromInput = String(formData.get("dateFrom") ?? "").trim();
    const dateToInput = String(formData.get("dateTo") ?? "").trim();
    const hasInvertedDateRange =
      Boolean(dateFromInput) &&
      Boolean(dateToInput) &&
      dateFromInput > dateToInput;
    const dateFrom = hasInvertedDateRange ? dateToInput : dateFromInput;
    const dateTo = hasInvertedDateRange ? dateFromInput : dateToInput;

    replaceSearchParams({
      search: search || null,
      status: status || null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      page: 1,
      limit: Number.isFinite(nextLimit) ? nextLimit : catalogQueryState.limit,
    });
  }

  function clearSingleFilter(
    filter: "search" | "status" | "dateFrom" | "dateTo",
  ) {
    replaceSearchParams({
      search: filter === "search" ? null : catalogQueryState.search || null,
      status: filter === "status" ? null : catalogQueryState.status || null,
      dateFrom:
        filter === "dateFrom" ? null : catalogQueryState.dateFrom || null,
      dateTo: filter === "dateTo" ? null : catalogQueryState.dateTo || null,
      page: PAGINATION.DEFAULT_PAGE,
      limit: catalogQueryState.limit,
    });
  }

  function handleResetFilters() {
    replaceSearchParams({
      page: PAGINATION.DEFAULT_PAGE,
      limit: PAGINATION.DEFAULT_LIMIT,
      search: null,
      status: null,
      dateFrom: null,
      dateTo: null,
    });
  }

  function applyDatePreset(preset: "today" | "week" | "month") {
    const { dateFrom, dateTo } = getDatePresetRange(preset);

    replaceSearchParams({
      search: catalogQueryState.search || null,
      status: catalogQueryState.status || null,
      dateFrom,
      dateTo,
      page: PAGINATION.DEFAULT_PAGE,
      limit: catalogQueryState.limit,
    });
  }

  const currentPage = data?.pagination.page ?? catalogQueryState.page;
  const pageLimit = data?.pagination.limit ?? catalogQueryState.limit;
  const total = data?.pagination.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(pageLimit, 1)));
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const activeFilterCount = [
    catalogQueryState.search,
    catalogQueryState.status,
    catalogQueryState.dateFrom,
    catalogQueryState.dateTo,
  ].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;
  const isEmpty = !data?.data.length;
  const isFilteredEmpty = isEmpty && hasActiveFilters;
  const loadingLabel = hasActiveFilters
    ? `Loading events with ${activeFilterCount} active filter${activeFilterCount === 1 ? "" : "s"}...`
    : "Loading upcoming events...";
  const emptyTitle = isFilteredEmpty
    ? "No events matched your filters"
    : "No events available right now";
  const emptyMessage = isFilteredEmpty
    ? "Try clearing one or more filters, or broaden the date range to discover more events."
    : "There are no public events to display yet. Check back soon for new listings.";

  function goToPage(nextPage: number) {
    const safePage = Math.max(1, Math.min(totalPages, nextPage));
    replaceSearchParams({
      search: catalogQueryState.search || null,
      status: catalogQueryState.status || null,
      dateFrom: catalogQueryState.dateFrom || null,
      dateTo: catalogQueryState.dateTo || null,
      page: safePage,
      limit: catalogQueryState.limit,
    });
  }

  function handlePageJumpSubmit(event: FormSubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const boundedPage = getBoundedPageJump(
      String(formData.get("pageJump") ?? currentPage),
      currentPage,
      totalPages,
    );
    goToPage(boundedPage);
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 text-center text-muted-foreground">
        <p className="text-sm uppercase tracking-[0.18em]">Discover events</p>
        <p className="mt-3 text-base font-medium text-foreground">
          {loadingLabel}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 text-center text-muted-foreground">
        <p className="text-base font-medium text-foreground">
          {catalogErrorCopy.listLoadTitle}
        </p>
        <p className="mt-2 text-sm">{catalogErrorCopy.listLoadMessage}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => void refetch()}
            data-agent-type="action"
            data-entity-type="catalog-retry"
            data-entity-id="catalog-events"
            data-mutation-trigger="retry-load"
          >
            {commonCopy.retryLabel}
          </Button>
          {hasActiveFilters ? (
            <Button
              variant="ghost"
              onClick={handleResetFilters}
              data-agent-type="action"
              data-entity-type="catalog-clear-filters"
              data-entity-id="catalog-events"
              data-mutation-trigger="reset-filters"
            >
              {catalogErrorCopy.clearFiltersLabel}
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Discover events</p>
          <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Search by name, filter by status, and narrow by date range before
            you open the event detail page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeFilterCount ? (
            <Badge variant="info">
              {activeFilterCount} active filter
              {activeFilterCount === 1 ? "" : "s"}
            </Badge>
          ) : (
            <Badge variant="secondary">No filters active</Badge>
          )}
          {user?.role ? (
            <Badge variant="outline">Signed in as {user.role}</Badge>
          ) : null}
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {catalogQueryState.search ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearSingleFilter("search")}
            >
              Search: {catalogQueryState.search} x
            </Button>
          ) : null}
          {catalogQueryState.status ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearSingleFilter("status")}
            >
              Status: {catalogQueryState.status.replaceAll("_", " ")} x
            </Button>
          ) : null}
          {catalogQueryState.dateFrom ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearSingleFilter("dateFrom")}
            >
              From: {catalogQueryState.dateFrom} x
            </Button>
          ) : null}
          {catalogQueryState.dateTo ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearSingleFilter("dateTo")}
            >
              To: {catalogQueryState.dateTo} x
            </Button>
          ) : null}
        </div>
      ) : null}

      <form
        key={catalogFormKey}
        onSubmit={handleFilterSubmit}
        className="mb-6 rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm"
      >
        <fieldset
          className="space-y-4"
          data-agent-type="state-display"
          data-entity-type="catalog-filters"
          data-state-keys="search,status,dateFrom,dateTo,limit,page"
        >
          <legend className="mb-3 text-sm font-medium text-foreground">
            Find events
          </legend>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
            <Input
              name="search"
              defaultValue={catalogQueryState.search}
              onChange={(event) => handleSearchInputChange(event.target.value)}
              placeholder="Search events"
              aria-label="Search events"
              data-agent-type="input"
              data-entity-type="catalog-search"
            />

            <select
              name="status"
              defaultValue={catalogQueryState.status}
              aria-label="Filter by status"
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              data-agent-type="input"
              data-entity-type="catalog-status"
            >
              {EVENT_STATUS_OPTIONS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <Input
              name="dateFrom"
              type="date"
              defaultValue={catalogQueryState.dateFrom}
              aria-label="Start date"
              data-agent-type="input"
              data-entity-type="catalog-date-from"
            />

            <Input
              name="dateTo"
              type="date"
              defaultValue={catalogQueryState.dateTo}
              aria-label="End date"
              data-agent-type="input"
              data-entity-type="catalog-date-to"
            />

            <select
              name="limit"
              defaultValue={catalogQueryState.limit}
              aria-label="Results per page"
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              data-agent-type="input"
              data-entity-type="catalog-limit"
            >
              {PAGINATION.LIMIT_OPTIONS.map((limit) => (
                <option key={limit} value={limit}>
                  {limit} per page
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2 xl:col-span-1">
              <Button
                type="submit"
                className="flex-1"
                data-agent-type="action"
                data-entity-type="catalog-apply-filters"
                data-entity-id="catalog-events"
                data-mutation-trigger="apply-filters"
              >
                Apply filters
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetFilters}
                data-agent-type="action"
                data-entity-type="catalog-reset-filters"
                data-entity-id="catalog-events"
                data-mutation-trigger="reset-filters"
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              Showing page {currentPage} of {totalPages} • {total} total events
            </span>
            {isFetching ? <span>Refreshing data...</span> : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => applyDatePreset("today")}
            >
              Today
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => applyDatePreset("week")}
            >
              This week
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => applyDatePreset("month")}
            >
              This month
            </Button>
          </div>
        </fieldset>
      </form>

      {isEmpty ? (
        <div className="rounded-2xl border border-border/60 bg-background/70 p-8 text-center text-muted-foreground">
          <p className="text-base font-medium text-foreground">{emptyTitle}</p>
          <p className="mt-2 text-sm">{emptyMessage}</p>
          {hasActiveFilters ? (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={handleResetFilters}>
                Clear filters
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      {!isEmpty ? (
        <CatalogEventGrid
          events={data?.data ?? []}
          queryState={catalogQueryState}
          isRefreshing={isFetching}
        />
      ) : null}

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/80 p-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!hasPrevious}
            onClick={() => goToPage(currentPage - 1)}
            data-agent-type="action"
            data-entity-type="catalog-page-prev"
            data-entity-id="catalog-events"
            data-mutation-trigger="paginate"
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!hasNext}
            onClick={() => goToPage(currentPage + 1)}
            data-agent-type="action"
            data-entity-type="catalog-page-next"
            data-entity-id="catalog-events"
            data-mutation-trigger="paginate"
          >
            Next
          </Button>
          <form
            key={`${catalogFormKey}-jump`}
            onSubmit={handlePageJumpSubmit}
            className="flex items-center gap-2"
          >
            <Input
              name="pageJump"
              type="number"
              min={1}
              max={totalPages}
              defaultValue={currentPage}
              aria-label="Jump to page"
              className="w-24"
              data-agent-type="input"
              data-entity-type="catalog-page-jump"
            />
            <Button
              type="submit"
              variant="ghost"
              data-agent-type="action"
              data-entity-type="catalog-page-go"
              data-entity-id="catalog-events"
              data-mutation-trigger="paginate"
            >
              Go
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
