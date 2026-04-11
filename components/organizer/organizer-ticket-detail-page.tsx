"use client";

import { useQuery } from "@tanstack/react-query";

import { RouteAuthGuard } from "@/components/auth/route-auth-guard";
import { OrganizerUnauthorizedState } from "@/components/auth/organizer-unauthorized-state";
import { OrganizerBreadcrumbNav } from "@/components/organizer/organizer-breadcrumb-nav";
import { OrganizerTicketQrValidationAction } from "@/components/organizer/organizer-ticket-qr-validation-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_MESSAGES } from "@/core/messages";
import { readOrganizerQueryState, toURLSearchParams } from "@/lib/query";
import { getOrganizerEventTicketDetail } from "@/services/organizer.service";

type OrganizerTicketDetailPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
  ticketId: string;
};

function OrganizerTicketDetailPage({
  searchParams = {},
  ticketId,
}: OrganizerTicketDetailPageProps) {
  const queryState = readOrganizerQueryState(toURLSearchParams(searchParams));
  const organizerErrorCopy = UI_MESSAGES.ORGANIZER;
  const commonCopy = UI_MESSAGES.COMMON;

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["organizer-ticket-detail", queryState.eventId, ticketId],
    queryFn: () => getOrganizerEventTicketDetail(queryState.eventId, ticketId),
    enabled: Boolean(queryState.eventId),
    staleTime: 60 * 1000,
  });

  const ticket = data?.data;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <RouteAuthGuard unauthorizedFallback={<OrganizerUnauthorizedState />}>
        <OrganizerBreadcrumbNav state={queryState} current="ticket-detail" />
        <Card>
          <CardHeader>
            <CardTitle>Organizer Ticket Detail</CardTitle>
          </CardHeader>
          <CardContent>
            {!queryState.eventId ? (
              <p className="text-sm text-muted-foreground">
                Missing event context. Go back to dashboard and open ticket
                detail from an event list.
              </p>
            ) : null}

            {queryState.eventId && isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading ticket detail...
              </p>
            ) : null}

            {queryState.eventId && isError ? (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
                <p>{organizerErrorCopy.ticketDetailLoadMessage}</p>
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

            {queryState.eventId && !isLoading && !isError && ticket ? (
              <div className="space-y-2 text-sm">
                <p>
                  Ticket ID:{" "}
                  <span className="font-mono">{ticket.ticketId}</span>
                </p>
                <p>Event: {ticket.eventName}</p>
                <p>Status: {ticket.status}</p>
                <p>Holder: {ticket.holderName}</p>
                <p>
                  Seat: {ticket.sectionName} / {ticket.rowLabel} /{" "}
                  {ticket.seatLabel}
                </p>
              </div>
            ) : null}

            {isFetching && !isLoading ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Refreshing detail...
              </p>
            ) : null}

            {queryState.eventId ? (
              <OrganizerTicketQrValidationAction eventId={queryState.eventId} />
            ) : null}
          </CardContent>
        </Card>
      </RouteAuthGuard>
    </main>
  );
}

export { OrganizerTicketDetailPage };
export default OrganizerTicketDetailPage;
