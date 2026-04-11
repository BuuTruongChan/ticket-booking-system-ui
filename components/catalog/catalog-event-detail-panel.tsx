import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/formatter";
import type { Event } from "@schemas/event";

type CatalogEventDetailPanelProps = {
  event: Event;
  backHref: string;
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

export function CatalogEventDetailPanel({
  event,
  backHref,
}: CatalogEventDetailPanelProps) {
  return (
    <Card
      data-agent-type="state-display"
      data-entity-type="catalog-event-detail"
      data-entity-id={event.id}
      data-state-keys="eventName,eventCode,venue,status,eventDate,desc"
    >
      <CardHeader>
        <CardTitle>{event.eventName}</CardTitle>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant={EVENT_STATUS_VARIANTS[event.status]}>
            {event.status.replaceAll("_", " ")}
          </Badge>
          <Badge variant="outline">Code {event.eventCode}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Venue: {event.venue}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Event date: {formatDateTime(event.eventDate)}
        </p>
        {event.desc ? (
          <p className="mt-4 text-sm text-foreground">{event.desc}</p>
        ) : null}

        <div className="mt-6">
          <Link href={backHref}>
            <Button
              variant="outline"
              data-agent-type="action"
              data-entity-type="catalog-event-back-link"
              data-entity-id={event.eventCode}
              data-mutation-trigger="back-to-events"
            >
              Back to events
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
