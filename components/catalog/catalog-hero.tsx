import { Badge } from "@/components/ui/badge";

type CatalogHeroProps = {
  activeFilterCount: number;
  userRole?: string;
};

export function CatalogHero({ activeFilterCount, userRole }: CatalogHeroProps) {
  return (
    <section className="mb-8 rounded-3xl border border-border/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-8 text-white shadow-lg">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/70">
            Discover events
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Find your next live experience
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/75 md:text-base">
            Browse concerts and shows, compare dates, and jump straight to
            ticket details in one flow.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeFilterCount ? (
            <Badge variant="info">
              {activeFilterCount} active filter
              {activeFilterCount === 1 ? "" : "s"}
            </Badge>
          ) : (
            <Badge variant="secondary">No filters active</Badge>
          )}
          {userRole ? (
            <Badge
              className="border-white/30 bg-white/10 text-white"
              variant="outline"
            >
              Signed in as {userRole}
            </Badge>
          ) : null}
        </div>
      </div>
    </section>
  );
}
