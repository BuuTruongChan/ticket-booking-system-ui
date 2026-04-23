import { Button } from "@/components/ui/button";

export type ActiveFilterKey =
  | "search"
  | "location"
  | "category"
  | "dateFrom"
  | "dateTo";

type CatalogActiveFiltersProps = {
  search: string;
  location: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  onClear: (key: ActiveFilterKey) => void;
};

export function CatalogActiveFilters({
  search,
  location,
  category,
  dateFrom,
  dateTo,
  onClear,
}: CatalogActiveFiltersProps) {
  const hasAny = Boolean(search || location || category || dateFrom || dateTo);
  if (!hasAny) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {search ? (
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full border border-border/70"
          onClick={() => onClear("search")}
        >
          Search: {search} x
        </Button>
      ) : null}
      {location ? (
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full border border-border/70"
          onClick={() => onClear("location")}
        >
          Location: {location} x
        </Button>
      ) : null}
      {category ? (
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full border border-border/70"
          onClick={() => onClear("category")}
        >
          Category: {category} x
        </Button>
      ) : null}
      {dateFrom ? (
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full border border-border/70"
          onClick={() => onClear("dateFrom")}
        >
          From: {dateFrom} x
        </Button>
      ) : null}
      {dateTo ? (
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full border border-border/70"
          onClick={() => onClear("dateTo")}
        >
          To: {dateTo} x
        </Button>
      ) : null}
    </div>
  );
}
