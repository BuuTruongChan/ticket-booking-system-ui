"use client";

import Link from "next/link";

import { useCurrentUserOrGuest } from "@/hooks/user";
import { hasRequiredRole, ORGANIZER_ALLOWED_ROLES } from "@/lib/auth";

export function HeaderOrganizerLink() {
  const { data: user } = useCurrentUserOrGuest();
  const canAccessOrganizer = hasRequiredRole(
    user?.role,
    ORGANIZER_ALLOWED_ROLES,
  );

  if (!canAccessOrganizer) {
    return (
      <span
        data-agent-type="state-display"
        data-entity-type="nav-link"
        data-state-keys="restricted"
        data-permission-required={ORGANIZER_ALLOWED_ROLES.join("|")}
        data-permission-available={user?.role ?? "GUEST"}
        className="rounded-md border border-border/60 px-3 py-1.5 text-xs text-muted-foreground"
        aria-disabled="true"
      >
        Organizer (restricted)
      </span>
    );
  }

  return (
    <Link
      href="/organizer"
      data-agent-type="action"
      data-entity-type="nav-link"
      data-entity-id="organizer"
      className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-primary/15"
    >
      Organizer Dashboard
    </Link>
  );
}
