"use client";

import { useQuery } from "@tanstack/react-query";

import { catalogQueryKeys } from "@/features/catalog";
import type { CatalogQueryState } from "@/lib/query";
import { getCatalogEvents } from "@/services/catalog.service";

export function useCatalogEvents(queryState: CatalogQueryState) {
  const filters = {
    search: queryState.search.trim() || undefined,
    status: queryState.status || undefined,
    dateFrom: queryState.dateFrom.trim() || undefined,
    dateTo: queryState.dateTo.trim() || undefined,
  };

  return useQuery({
    queryKey: catalogQueryKeys.events(queryState),
    queryFn: async () => {
      return getCatalogEvents({
        page: queryState.page,
        limit: queryState.limit,
        ...filters,
      });
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
