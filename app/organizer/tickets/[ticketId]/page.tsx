import { OrganizerTicketDetailPage } from "@/components/organizer/organizer-ticket-detail-page";

type OrganizerTicketDetailPageProps = {
  params: {
    ticketId: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function OrganizerTicketDetailRoute({
  params,
  searchParams,
}: OrganizerTicketDetailPageProps) {
  return (
    <OrganizerTicketDetailPage
      ticketId={params.ticketId}
      searchParams={searchParams}
    />
  );
}
