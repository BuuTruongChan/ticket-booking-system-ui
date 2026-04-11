import OrganizerDashboardPage from "@/components/organizer/organizer-dashboard-page";

type OrganizerPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function OrganizerPage({ searchParams }: OrganizerPageProps) {
  return <OrganizerDashboardPage searchParams={searchParams} />;
}
