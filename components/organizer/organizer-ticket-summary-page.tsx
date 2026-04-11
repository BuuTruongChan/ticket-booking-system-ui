"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

import { RouteAuthGuard } from "@/components/auth/route-auth-guard";
import { OrganizerUnauthorizedState } from "@/components/auth/organizer-unauthorized-state";
import { OrganizerBreadcrumbNav } from "@/components/organizer/organizer-breadcrumb-nav";
import { OrganizerTicketTable } from "@/components/organizer/organizer-ticket-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { USER_ERROR_COPY } from "@/core/messages";
import {
  getBoundedPageJump,
  mergeSearchParams,
  readOrganizerQueryState,
  toURLSearchParams,
  withOrganizerQuery,
} from "@/lib/query";
import {
  getOrganizerEventTicketSummary,
  getOrganizerEventTickets,
} from "@/services/organizer.service";

type OrganizerTicketsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function OrganizerTicketSummaryPage({
  searchParams = {},
}: OrganizerTicketsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryState = readOrganizerQueryState(toURLSearchParams(searchParams));
  const organizerErrorCopy = UI_MESSAGES.ORGANIZER;
  const commonCopy = UI_MESSAGES.COMMON;

  const [pageJumpInput, setPageJumpInput] = useState(String(queryState.page));

  function replaceSearchParams(next: Record<string, string | number | null>) {
    const queryString = mergeSearchParams(
      toURLSearchParams(searchParams),
      next,
    );
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  function goToPage(nextPage: number) {
    const safePage = Math.max(1, nextPage);
    setPageJumpInput(String(safePage));
    replaceSearchParams({
      page: safePage,
      limit: queryState.limit,
    });
  }

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["organizer-ticket-summary", queryState.eventId],
    queryFn: () => getOrganizerEventTicketSummary(queryState.eventId),
    enabled: Boolean(queryState.eventId),
    staleTime: 60 * 1000,
  });

  const {
    data: ticketsData,
    isLoading: ticketsLoading,
    isError: ticketsError,
    refetch: refetchTickets,
    isFetching: ticketsFetching,
  } = useQuery({
    queryKey: [
      "organizer-event-tickets",
      queryState.eventId,
      queryState.page,
      queryState.limit,
    ],
    queryFn: () =>
      getOrganizerEventTickets(queryState.eventId, {
        page: queryState.page,
        limit: queryState.limit,
      }),
    enabled: Boolean(queryState.eventId),
    staleTime: 60 * 1000,
  });

  const currentPage = ticketsData?.pagination.page ?? queryState.page;
  const pageLimit = ticketsData?.pagination.limit ?? queryState.limit;
  const total = ticketsData?.pagination.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(pageLimit, 1)));
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <RouteAuthGuard unauthorizedFallback={<OrganizerUnauthorizedState />}>
        <OrganizerBreadcrumbNav state={queryState} current="tickets" />
        <Card>
          <CardHeader>
            <CardTitle>Organizer Ticket Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {!queryState.eventId ? (
              <p className="text-sm text-muted-foreground">
                Select an event from organizer dashboard to view ticket summary.
              </p>
            ) : null}

            {queryState.eventId && isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading ticket summary...
              </p>
            ) : null}

            {queryState.eventId && isError ? (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
                <p>{organizerErrorCopy.ticketSummaryLoadMessage}</p>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => void refetch()}
                  className="mt-2 h-auto p-0"
                >
                  {commonCopy.retryLabel}
                </Button>
              </div>
            ) : null}

            {queryState.eventId && !isLoading && !isError && data?.data ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-semibold">
                    {data.data.totalTickets}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground">Valid</p>
                  <p className="text-lg font-semibold">
                    {data.data.validTickets}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground">Used</p>
                  <p className="text-lg font-semibold">
                    {data.data.usedTickets}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground">Cancelled</p>
                  <p className="text-lg font-semibold">
                    {data.data.cancelledTickets}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground">Transferred</p>
                  <p className="text-lg font-semibold">
                    {data.data.transferredTickets}
                  </p>
                </div>
              </div>
            ) : null}

            {isFetching && !isLoading ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Refreshing summary...
              </p>
            ) : null}

            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-foreground">
                Tickets
              </p>

              {!queryState.eventId ? (
                <p className="text-sm text-muted-foreground">
                  Select an event to load ticket list.
                </p>
              ) : null}

              {queryState.eventId && ticketsLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading tickets...
                </p>
              ) : null}

              {queryState.eventId && ticketsError ? (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
                  <p>{organizerErrorCopy.ticketListLoadMessage}</p>
                  <Button
                    type="button"
                    variant="link"
                    className="mt-2 h-auto p-0"
                    onClick={() => void refetchTickets()}
                  >
                    {commonCopy.retryLabel}
                  </Button>
                </div>
              ) : null}

              {queryState.eventId &&
              !ticketsLoading &&
              !ticketsError &&
              ticketsData ? (
                <>
                  <OrganizerTicketTable
                    tickets={ticketsData.data}
                    buildTicketHref={(ticketId) =>
                      withOrganizerQuery(
                        `/organizer/tickets/${ticketId}`,
                        queryState,
                      )
                    }
                  />

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Page {currentPage} of {totalPages} • {total} total tickets
                    </p>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={pageJumpInput}
                        onChange={(event) =>
                          setPageJumpInput(event.target.value)
                        }
                        className="h-8 w-20"
                        data-entity-type="organizer-ticket-page-jump"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          goToPage(
                            getBoundedPageJump(
                              pageJumpInput,
                              currentPage,
                              totalPages,
                            ),
                          );
                        }}
                      >
                        Go
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!hasPrevious || ticketsFetching}
                        onClick={() => goToPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!hasNext || ticketsFetching}
                        onClick={() => goToPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              ) : null}

              {ticketsFetching && !ticketsLoading ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Refreshing ticket list...
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </RouteAuthGuard>
    </main>
  );
}
