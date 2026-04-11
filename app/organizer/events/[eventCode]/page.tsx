import OrganizerEventDetailPage from "@/components/organizer/organizer-event-detail-page";

type OrganizerEventDetailPageProps = {
  params: {
    eventCode: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function OrganizerEventDetailRoute({
  params,
  searchParams,
}: OrganizerEventDetailPageProps) {
  return (
    <OrganizerEventDetailPage
      eventCode={params.eventCode}
      searchParams={searchParams}
    />
  );
}
