import type { CatalogQueryState } from "@/lib/query";

export const catalogQueryKeys = {
  all: ["catalog"] as const,
  events: (state: CatalogQueryState) =>
    [...catalogQueryKeys.all, "events", state] as const,
};
