"use client";

import {
  type ComponentProps,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

import { CatalogActiveFilters } from "@/components/catalog/catalog-active-filters";
import { CatalogEventGrid } from "@/components/catalog/catalog-event-grid";
import { CatalogFilterPanel } from "@/components/catalog/catalog-filter-panel";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PAGINATION } from "@/core/constants";
import { UI_MESSAGES } from "@/core/messages";
import {
  buildLocationValue,
  parseLocationValue,
} from "@/features/catalog/vn-location";
import { useCatalogEvents } from "@/hooks/catalog";
import { useCurrentUserOrGuest } from "@/hooks/user";
import {
  mergeSearchParams,
  readCatalogQueryState,
  toURLSearchParams,
} from "@/lib/query";

type CatalogHomePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

type FormSubmitEvent = Parameters<
  NonNullable<ComponentProps<"form">["onSubmit"]>
>[0];

const SEARCH_SYNC_DEBOUNCE_MS = 400;
const CATALOG_FIXED_LIMIT = PAGINATION.DEFAULT_LIMIT;

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

type CatalogLoadingStateProps = { loadingLabel: string };

function CatalogLoadingState({ loadingLabel }: CatalogLoadingStateProps) {
  return (
    <div className="mb-6 rounded-2xl border border-border/60 bg-background/70 p-6 text-center text-muted-foreground">
      <p className="text-base font-medium text-foreground">{loadingLabel}</p>
    </div>
  );
}

type CatalogErrorStateProps = {
  title: string;
  message: string;
  retryLabel: string;
  clearFiltersLabel: string;
  hasActiveFilters: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
};

function CatalogErrorState({
  title,
  message,
  retryLabel,
  clearFiltersLabel,
  hasActiveFilters,
  onRetry,
  onClearFilters,
}: CatalogErrorStateProps) {
  return (
    <div className="mb-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-muted-foreground">{message}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={onRetry}
          data-agent-type="action"
          data-entity-type="catalog-retry"
          data-entity-id="catalog-events"
          data-mutation-trigger="retry-load"
        >
          {retryLabel}
        </Button>
        {hasActiveFilters ? (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            data-agent-type="action"
            data-entity-type="catalog-clear-filters"
            data-entity-id="catalog-events"
            data-mutation-trigger="reset-filters"
          >
            {clearFiltersLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
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
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

  const locationState = useMemo(
    () => parseLocationValue(catalogQueryState.location),
    [catalogQueryState.location],
  );
  const [selectedCity, setSelectedCity] = useState(locationState.city);
  const [selectedDistrict, setSelectedDistrict] = useState(
    locationState.district,
  );

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
      if (searchDebounceRef.current)
        window.clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = window.setTimeout(() => {
        const trimmedSearch = value.trim();
        if (trimmedSearch === catalogQueryState.search) return;
        replaceSearchParams({
          search: trimmedSearch || null,
          status: null,
          location: catalogQueryState.location || null,
          category: catalogQueryState.category || null,
          dateFrom: catalogQueryState.dateFrom || null,
          dateTo: catalogQueryState.dateTo || null,
          page: PAGINATION.DEFAULT_PAGE,
          limit: CATALOG_FIXED_LIMIT,
        });
      }, SEARCH_SYNC_DEBOUNCE_MS);
    },
    [catalogQueryState, replaceSearchParams],
  );

  function handleFilterSubmit(event: FormSubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const search = String(
      formData.get("search") ?? catalogQueryState.search,
    ).trim();
    const city = String(formData.get("city") ?? selectedCity).trim();
    const district = String(
      formData.get("district") ?? selectedDistrict,
    ).trim();
    const location = buildLocationValue(city, district);
    const category = String(
      formData.get("category") ?? catalogQueryState.category,
    ).trim();
    const dateFromInput = String(
      formData.get("dateFrom") ?? catalogQueryState.dateFrom,
    ).trim();
    const dateToInput = String(
      formData.get("dateTo") ?? catalogQueryState.dateTo,
    ).trim();
    const swapped =
      Boolean(dateFromInput) &&
      Boolean(dateToInput) &&
      dateFromInput > dateToInput;
    replaceSearchParams({
      search: search || null,
      status: null,
      location: location || null,
      category: category || null,
      dateFrom: swapped ? dateToInput : dateFromInput || null,
      dateTo: swapped ? dateFromInput : dateToInput || null,
      page: 1,
      limit: CATALOG_FIXED_LIMIT,
    });
    setIsFilterPopupOpen(false);
  }

  function handleOpenFilterPopup() {
    const loc = parseLocationValue(catalogQueryState.location);
    setSelectedCity(loc.city);
    setSelectedDistrict(loc.district);
    setIsFilterPopupOpen(true);
  }

  function clearSingleFilter(
    filter: "search" | "location" | "category" | "dateFrom" | "dateTo",
  ) {
    replaceSearchParams({
      search: filter === "search" ? null : catalogQueryState.search || null,
      status: null,
      location:
        filter === "location" ? null : catalogQueryState.location || null,
      category:
        filter === "category" ? null : catalogQueryState.category || null,
      dateFrom:
        filter === "dateFrom" ? null : catalogQueryState.dateFrom || null,
      dateTo: filter === "dateTo" ? null : catalogQueryState.dateTo || null,
      page: PAGINATION.DEFAULT_PAGE,
      limit: CATALOG_FIXED_LIMIT,
    });
  }

  function handleResetFilters() {
    replaceSearchParams({
      page: PAGINATION.DEFAULT_PAGE,
      limit: CATALOG_FIXED_LIMIT,
      search: null,
      status: null,
      location: null,
      category: null,
      dateFrom: null,
      dateTo: null,
    });
    setSelectedCity("");
    setSelectedDistrict("");
  }

  function applyDatePreset(preset: "today" | "week" | "month") {
    const { dateFrom, dateTo } = getDatePresetRange(preset);
    replaceSearchParams({
      search: catalogQueryState.search || null,
      status: null,
      location: catalogQueryState.location || null,
      category: catalogQueryState.category || null,
      dateFrom,
      dateTo,
      page: PAGINATION.DEFAULT_PAGE,
      limit: CATALOG_FIXED_LIMIT,
    });
  }

  const currentPage = data?.pagination.page ?? catalogQueryState.page;
  const pageLimit = data?.pagination.limit ?? catalogQueryState.limit;
  const total = data?.pagination.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(pageLimit, 1)));
  const activeFilterCount = [
    catalogQueryState.search,
    catalogQueryState.location,
    catalogQueryState.category,
    catalogQueryState.dateFrom,
    catalogQueryState.dateTo,
  ].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;
  const isInitialLoading = isLoading && !data;
  const isEmpty = !isError && !isInitialLoading && !data?.data.length;
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
      status: null,
      location: catalogQueryState.location || null,
      category: catalogQueryState.category || null,
      dateFrom: catalogQueryState.dateFrom || null,
      dateTo: catalogQueryState.dateTo || null,
      page: safePage,
      limit: CATALOG_FIXED_LIMIT,
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <CatalogHero
        activeFilterCount={activeFilterCount}
        userRole={user?.role}
      />

      <CatalogActiveFilters
        search={catalogQueryState.search}
        location={catalogQueryState.location}
        category={catalogQueryState.category}
        dateFrom={catalogQueryState.dateFrom}
        dateTo={catalogQueryState.dateTo}
        onClear={clearSingleFilter}
      />

      <form
        key={catalogFormKey}
        onSubmit={handleFilterSubmit}
        className="mb-6 rounded-3xl border border-border/60 bg-card p-5 shadow-sm"
      >
        <fieldset
          className="space-y-4"
          data-agent-type="state-display"
          data-entity-type="catalog-filters"
          data-state-keys="search,location,category,dateFrom,dateTo,page"
        >
          <legend className="mb-3 text-sm font-medium text-foreground">
            Find events
          </legend>

          <div className="relative flex items-center gap-2">
            <Input
              name="search"
              defaultValue={catalogQueryState.search}
              onChange={(event) => handleSearchInputChange(event.target.value)}
              placeholder="Artist, event or venue"
              aria-label="Search events"
              className="h-11 w-full pr-24"
              data-agent-type="input"
              data-entity-type="catalog-search"
            />
            <div className="absolute right-2 flex items-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="outline"
                aria-label="Open filters"
                onClick={() => {
                  if (isFilterPopupOpen) {
                    setIsFilterPopupOpen(false);
                    return;
                  }
                  handleOpenFilterPopup();
                }}
                data-agent-type="action"
                data-entity-type="catalog-open-filters"
                data-entity-id="catalog-events"
                data-mutation-trigger="open-filters"
              >
                <SlidersHorizontal className="size-4" />
              </Button>
              <Button type="submit" size="icon" aria-label="Search">
                <Search className="size-4" />
              </Button>
            </div>
          </div>

          {isFilterPopupOpen ? (
            <CatalogFilterPanel
              selectedCity={selectedCity}
              selectedDistrict={selectedDistrict}
              defaultCategory={catalogQueryState.category}
              defaultDateFrom={catalogQueryState.dateFrom}
              defaultDateTo={catalogQueryState.dateTo}
              onCityChange={setSelectedCity}
              onDistrictChange={setSelectedDistrict}
              onClose={() => setIsFilterPopupOpen(false)}
              onReset={handleResetFilters}
            />
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              Showing page {currentPage} of {totalPages} • {total} total events
            </span>
            {isFetching ? <span>Refreshing data...</span> : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full border border-border/60"
              onClick={() => applyDatePreset("today")}
            >
              Today
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full border border-border/60"
              onClick={() => applyDatePreset("week")}
            >
              This week
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full border border-border/60"
              onClick={() => applyDatePreset("month")}
            >
              This month
            </Button>
          </div>
        </fieldset>
      </form>

      {isInitialLoading ? (
        <CatalogLoadingState loadingLabel={loadingLabel} />
      ) : null}

      {isError ? (
        <CatalogErrorState
          title={catalogErrorCopy.listLoadTitle}
          message={catalogErrorCopy.listLoadMessage}
          retryLabel={commonCopy.retryLabel}
          clearFiltersLabel={catalogErrorCopy.clearFiltersLabel}
          hasActiveFilters={hasActiveFilters}
          onRetry={() => void refetch()}
          onClearFilters={handleResetFilters}
        />
      ) : null}

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

      {!isInitialLoading && !isError && !isEmpty ? (
        <CatalogEventGrid
          events={data?.data ?? []}
          queryState={catalogQueryState}
          isRefreshing={isFetching}
        />
      ) : null}

      {!isInitialLoading && !isError ? (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          totalLabel="events"
          isFetching={isFetching}
          onPageChange={goToPage}
          className="mt-8"
        />
      ) : null}
    </main>
  );
}
