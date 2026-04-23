# Handoff

## Last Completed Ticket

REF-005 — Create `app/organizer/layout.tsx` with centralized auth guard

## Next Ticket

REF-006 — Build shared `<PaginationControls>` component

- Create `components/shared/pagination-controls.tsx`
- Props: `currentPage`, `totalPages`, `onPageChange(page: number)`, `isFetching`, optional `className`
- Replace usage in `CatalogHomePage` and `OrganizerTicketSummaryPage`
- Note: `OrganizerDashboardPage` uses a slightly different inline pattern (page jump inside a `<form onSubmit>`) — evaluate whether it fits the shared component or stays custom

## Open Questions

- None blocking REF-006

## Decisions Made

- jsdom is the global vitest environment
- Confirmed in-use: `@base-ui/react` (Button), `next-themes` (Toaster), `tw-animate-css` (globals.css) — original audit was wrong about these
- Audit correction: only `react-hook-form`, `@hookform/resolvers`, `usehooks-ts` were dead
- `app/organizer/layout.tsx` is a Server Component — delegates client-side auth check to `RouteAuthGuard` (already a client component). Valid RSC boundary pattern.

## Do Not Touch

- `schemas/**` — frozen, no structural changes
- `lib/api/api-client.ts` — frozen until explicit ticket
- `components/ui/button.tsx` — depends on `@base-ui/react`, do not touch
- `app/organizer/layout.tsx` — just created; do not touch until next organizer ticket
