import { CatalogEventCard } from "@/components/catalog/catalog-event-card";
import type { CatalogQueryState } from "@/lib/query";
import type { Event } from "@schemas/event";

type CatalogEventGridProps = {
  events: Event[];
  queryState: CatalogQueryState;
  isRefreshing?: boolean;
};

export function CatalogEventGrid({
  events,
  queryState,
  isRefreshing = false,
}: CatalogEventGridProps) {
  if (!events.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No events available right now.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isRefreshing ? (
        <p className="text-xs text-muted-foreground">Updating results...</p>
      ) : null}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {events.map((event) => (
          <CatalogEventCard
            key={event.id}
            event={event}
            queryState={queryState}
          />
        ))}
      </div>
    </div>
  );
}
