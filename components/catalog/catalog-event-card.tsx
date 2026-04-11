import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMediumDate } from "@/lib/formatter";
import { withCatalogQuery, type CatalogQueryState } from "@/lib/query";
import type { Event } from "@schemas/event";

type CatalogEventCardProps = {
  event: Event;
  queryState: CatalogQueryState;
};

const EVENT_STATUS_VARIANTS: Record<
  Event["status"],
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "outline"
> = {
  DRAFT: "outline",
  UPCOMING: "info",
  ON_SALE: "success",
  SOLD_OUT: "destructive",
  FINISHED: "secondary",
  CANCELLED: "warning",
};

export function CatalogEventCard({ event, queryState }: CatalogEventCardProps) {
  return (
    <Card
      className="overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      data-agent-type="state-display"
      data-entity-type="catalog-event-card"
      data-entity-id={event.id}
      data-state-keys="eventName,eventCode,venue,eventDate,status"
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Event preview
            </p>
            <CardTitle className="text-lg leading-tight">
              {event.eventName}
            </CardTitle>
          </div>
          <Badge variant={EVENT_STATUS_VARIANTS[event.status]}>
            {event.status.replaceAll("_", " ")}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Code <span className="font-mono">{event.eventCode}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-background/70 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Date
            </p>
            <p className="mt-1 font-medium text-foreground">
              {formatMediumDate(event.eventDate)}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/70 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Venue
            </p>
            <p className="mt-1 font-medium text-foreground">{event.venue}</p>
          </div>
        </div>

        {event.desc ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {event.desc}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Open the detail view for the latest event information.
          </p>
        )}

        <Link href={withCatalogQuery(`/events/${event.eventCode}`, queryState)}>
          <Button
            className="w-full"
            variant="outline"
            data-agent-type="action"
            data-entity-type="catalog-event-link"
            data-entity-id={event.eventCode}
            data-mutation-trigger="open-event-detail"
          >
            View Event
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
