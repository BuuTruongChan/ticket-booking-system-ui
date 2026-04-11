import { CatalogEventDetailPanel } from "@/components/catalog";
import { WaitRoomEntryCard } from "@/components/waitroom";
import {
  readCatalogQueryState,
  toURLSearchParams,
  withCatalogQuery,
} from "@/lib/query";
import { getCatalogEventDetail } from "@/services/catalog.service";
import type { Event } from "@schemas/event";
import { UI_MESSAGES } from "@/core/messages";

type EventDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EventDetailPage({
  params,
  searchParams,
}: EventDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const urlParams = toURLSearchParams(resolvedSearchParams);

  const catalogQueryState = readCatalogQueryState({
    get: (name: string) => urlParams.get(name),
  });
  const backHref = withCatalogQuery("/", catalogQueryState);
  let event: Event;

  try {
    const response = await getCatalogEventDetail(id);
    event = response.data;
  } catch {
    throw new Error(UI_MESSAGES.CATALOG_EVENT_DETAIL.routeThrowMessage);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <CatalogEventDetailPanel event={event} backHref={backHref} />
      <WaitRoomEntryCard eventId={event.id} />
    </main>
  );
}
