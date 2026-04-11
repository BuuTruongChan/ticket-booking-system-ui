import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { TicketListItem } from "@schemas/ticket";

type OrganizerTicketTableProps = {
  tickets: TicketListItem[];
  buildTicketHref: (ticketId: string) => string;
};

export function OrganizerTicketTable({
  tickets,
  buildTicketHref,
}: OrganizerTicketTableProps) {
  if (!tickets.length) {
    return (
      <div className="rounded-xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
        No tickets found for this event.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/40 text-left text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Ticket ID</th>
            <th className="px-3 py-2 font-medium">Holder</th>
            <th className="px-3 py-2 font-medium">Seat</th>
            <th className="px-3 py-2 font-medium">Section</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Purchased</th>
            <th className="px-3 py-2 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.ticketId} className="border-t border-border/50">
              <td className="px-3 py-2 font-mono text-xs">{ticket.ticketId}</td>
              <td className="px-3 py-2">{ticket.holderName}</td>
              <td className="px-3 py-2">{ticket.seatLabel}</td>
              <td className="px-3 py-2">{ticket.sectionName}</td>
              <td className="px-3 py-2">{ticket.status}</td>
              <td className="px-3 py-2 text-muted-foreground">
                {new Date(ticket.purchasedAt).toLocaleString()}
              </td>
              <td className="px-3 py-2">
                <Link href={buildTicketHref(ticket.ticketId)}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
