import Link from "next/link";

import { Button } from "@/components/ui/button";
import { type OrganizerQueryState, withOrganizerQuery } from "@/lib/query";

type OrganizerBreadcrumbNavProps = {
  state: OrganizerQueryState & { eventCode?: string };
  current: "dashboard" | "tickets" | "event-detail" | "ticket-detail";
};

export function OrganizerBreadcrumbNav({
  state,
  current,
}: OrganizerBreadcrumbNavProps) {
  const eventCode = state.eventCode ?? "";
  const dashboardHref = withOrganizerQuery("/organizer", state);
  const ticketsHref = withOrganizerQuery("/organizer/tickets", state);
  const eventDetailHref = eventCode
    ? withOrganizerQuery(`/organizer/events/${eventCode}`, state)
    : null;

  return (
    <nav className="mb-4 flex flex-wrap items-center gap-2">
      <Link href={dashboardHref}>
        <Button
          variant={current === "dashboard" ? "default" : "outline"}
          size="sm"
        >
          Dashboard
        </Button>
      </Link>
      <Link href={ticketsHref}>
        <Button
          variant={current === "tickets" ? "default" : "outline"}
          size="sm"
        >
          Tickets
        </Button>
      </Link>
      {eventDetailHref ? (
        <Link href={eventDetailHref}>
          <Button
            variant={current === "event-detail" ? "default" : "outline"}
            size="sm"
          >
            Event Detail
          </Button>
        </Link>
      ) : null}
    </nav>
  );
}
