import type { ReactNode } from "react";

import { OrganizerUnauthorizedState } from "@/components/auth/organizer-unauthorized-state";
import { RouteAuthGuard } from "@/components/auth/route-auth-guard";

export default function OrganizerLayout({ children }: { children: ReactNode }) {
  return (
    <RouteAuthGuard unauthorizedFallback={<OrganizerUnauthorizedState />}>
      {children}
    </RouteAuthGuard>
  );
}
