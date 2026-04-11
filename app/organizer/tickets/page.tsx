import OrganizerTicketSummaryPage from "@/components/organizer/organizer-ticket-summary-page";

type OrganizerTicketsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function OrganizerTicketsRoute({
  searchParams,
}: OrganizerTicketsPageProps) {
  return <OrganizerTicketSummaryPage searchParams={searchParams} />;
}
