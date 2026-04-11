"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { RouteAuthGuard } from "@/components/auth/route-auth-guard";
import { OrganizerUnauthorizedState } from "@/components/auth/organizer-unauthorized-state";
import { OrganizerBreadcrumbNav } from "@/components/organizer/organizer-breadcrumb-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_MESSAGES } from "@/core/messages";
import {
  readOrganizerQueryState,
  toURLSearchParams,
  withOrganizerQuery,
} from "@/lib/query";
import { getEventDetail } from "@/services/event.service";

type OrganizerEventDetailPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
  eventCode: string;
};

export default function OrganizerEventDetailPage({
  searchParams = {},
  eventCode,
}: OrganizerEventDetailPageProps) {
  const baseQueryState = readOrganizerQueryState(
    toURLSearchParams(searchParams),
  );
  const organizerErrorCopy = UI_MESSAGES.ORGANIZER;
  const commonCopy = UI_MESSAGES.COMMON;

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["organizer-event-detail", eventCode],
    queryFn: () => getEventDetail(eventCode),
    staleTime: 60 * 1000,
  });

  const event = data?.data;
  const queryState = {
    ...baseQueryState,
    eventCode,
    eventId: event?.id ?? baseQueryState.eventId,
  };

  const ticketsHref = withOrganizerQuery("/organizer/tickets", queryState);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <RouteAuthGuard unauthorizedFallback={<OrganizerUnauthorizedState />}>
        <OrganizerBreadcrumbNav state={queryState} current="event-detail" />
        <Card>
          <CardHeader>
            <CardTitle>Organizer Event Detail</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading event details...
              </p>
            ) : null}

            {isError ? (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
                <p>{organizerErrorCopy.eventDetailLoadMessage}</p>
                <Button
                  type="button"
                  variant="link"
                  className="mt-2 h-auto p-0"
                  onClick={() => void refetch()}
                >
                  {commonCopy.retryLabel}
                </Button>
              </div>
            ) : null}

            {!isLoading && !isError && !event ? (
              <p className="text-sm text-muted-foreground">
                {organizerErrorCopy.eventNotFoundMessage}
              </p>
            ) : null}

            {!isLoading && !isError && event ? (
              <>
                <p className="mb-2 text-sm text-muted-foreground">
                  Event code:{" "}
                  <span className="font-mono">{event.eventCode}</span>
                </p>
                <p className="text-base font-medium text-foreground">
                  {event.eventName}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {event.venue}
                </p>
              </>
            ) : null}

            <div className="mt-4 flex items-center gap-2">
              <Link href={ticketsHref}>
                <Button variant="outline">Go to tickets summary</Button>
              </Link>
            </div>

            {isFetching && !isLoading ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Refreshing data...
              </p>
            ) : null}
          </CardContent>
        </Card>
      </RouteAuthGuard>
    </main>
  );
}
