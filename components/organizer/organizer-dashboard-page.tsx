"use client";

import { type ComponentProps, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { OrganizerBreadcrumbNav } from "@/components/organizer/organizer-breadcrumb-nav";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PAGINATION } from "@/core/constants";
import { UI_MESSAGES } from "@/core/messages";
import { useCurrentUserOrGuest } from "@/hooks/user";
import {
  mergeSearchParams,
  ORGANIZER_STATUS_OPTIONS,
  readOrganizerQueryState,
  toURLSearchParams,
  withOrganizerQuery,
} from "@/lib/query";
import { getOrganizerEvents } from "@/services/organizer.service";

const organizerEventDateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

type OrganizerDashboardPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

type FormSubmitEvent = Parameters<
  NonNullable<ComponentProps<"form">["onSubmit"]>
>[0];

export default function OrganizerDashboardPage({
  searchParams = {},
}: OrganizerDashboardPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user } = useCurrentUserOrGuest();
  const safeMessages = UI_MESSAGES as {
    ORGANIZER: { dashboardLoadMessage: string };
    COMMON: { retryLabel: string };
  };
  const organizerErrorCopy = safeMessages.ORGANIZER;
  const commonCopy = safeMessages.COMMON;

  const urlParams = useMemo(
    () => toURLSearchParams(searchParams),
    [searchParams],
  );
  const requestParams = useMemo(
    () => readOrganizerQueryState(urlParams),
    [urlParams],
  );

  const [queryInput, setQueryInput] = useState(requestParams.q);
  const [statusInput, setStatusInput] = useState<string>(requestParams.status);
  function replaceSearchParams(next: Record<string, string | number | null>) {
    const queryString = mergeSearchParams(urlParams, next);
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  function handleFilterSubmit(event: FormSubmitEvent) {
    event.preventDefault();

    replaceSearchParams({
      q: queryInput.trim() || null,
      status: statusInput.trim() || null,
      page: 1,
      limit: requestParams.limit,
    });
  }

  function goToPage(nextPage: number) {
    const safePage = Math.max(1, nextPage);
    replaceSearchParams({
      q: requestParams.q || null,
      status: requestParams.status || null,
      page: safePage,
      limit: requestParams.limit,
    });
  }

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: [
      "organizer-events",
      {
        page: requestParams.page,
        limit: requestParams.limit,
        q: requestParams.q,
        status: requestParams.status,
      },
    ],
    queryFn: () =>
      getOrganizerEvents({
        page: requestParams.page,
        limit: requestParams.limit,
        q: requestParams.q || undefined,
        status: requestParams.status || undefined,
      }),
    staleTime: 60 * 1000,
  });

  const currentPage = data?.pagination.page ?? requestParams.page;
  const pageLimit = data?.pagination.limit ?? requestParams.limit;
  const total = data?.pagination.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(pageLimit, 1)));
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Organizer Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Signed in as <span className="font-medium">{user?.role}</span>. This
            dashboard loads data from `/search/organizer/events`.
          </p>

          <OrganizerBreadcrumbNav state={requestParams} current="dashboard" />

          <form onSubmit={handleFilterSubmit} className="mb-4 space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <Input
                value={queryInput}
                onChange={(event) => setQueryInput(event.target.value)}
                placeholder="Search by event name"
                data-entity-type="organizer-search"
              />
              <select
                value={statusInput}
                onChange={(event) => setStatusInput(event.target.value)}
                data-entity-type="organizer-status"
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All statuses</option>
                {ORGANIZER_STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <select
                value={String(requestParams.limit)}
                onChange={(event) => {
                  const nextLimit = Number(event.target.value);
                  replaceSearchParams({
                    q: requestParams.q || null,
                    status: requestParams.status || null,
                    page: 1,
                    limit: nextLimit,
                  });
                }}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                data-entity-type="organizer-limit"
              >
                {PAGINATION.LIMIT_OPTIONS.map((limitOption) => (
                  <option key={limitOption} value={limitOption}>
                    {limitOption} per page
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <Button type="submit" variant="outline">
                  Apply filters
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setQueryInput("");
                    setStatusInput("");
                    replaceSearchParams({
                      q: null,
                      status: null,
                      page: 1,
                      limit: requestParams.limit,
                    });
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </form>

          {isLoading ? (
            <div className="rounded-xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
              Loading organizer events...
            </div>
          ) : null}

          {isError ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
              <p>{organizerErrorCopy.dashboardLoadMessage}</p>
              <Button
                type="button"
                variant="link"
                onClick={() => void refetch()}
                className="mt-2 h-auto p-0"
                data-agent-type="action"
                data-entity-type="retry"
                data-entity-id="organizer-events"
              >
                {commonCopy.retryLabel}
              </Button>
            </div>
          ) : null}

          {!isLoading && !isError && !data?.data.length ? (
            <div className="rounded-xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
              No organizer events found for the current filters.
            </div>
          ) : null}

          {!isLoading && !isError && data?.data.length ? (
            <div className="space-y-3">
              {data.data.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-border/60 bg-background/70 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-foreground">
                      {event.eventName}
                    </p>
                    <Link
                      href={withOrganizerQuery(
                        `/organizer/events/${event.eventCode}`,
                        {
                          ...requestParams,
                          eventId: event.id,
                          eventCode: event.eventCode,
                        },
                      )}
                    >
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.venue} •{" "}
                    {organizerEventDateFormatter.format(
                      new Date(event.eventDate),
                    )}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {isFetching && !isLoading ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Refreshing data...
            </p>
          ) : null}

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            totalLabel="events"
            isFetching={isFetching}
            onPageChange={goToPage}
            className="mt-4"
          />
        </CardContent>
      </Card>
    </main>
  );
}
