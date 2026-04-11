"use client";

import type { ReactNode } from "react";

import { LoadingShell } from "@/components/auth/loading-shell";
import { UnauthorizedState } from "@/components/auth/unauthorized-state";
import { useCurrentUserOrGuest } from "@/hooks/user";
import { hasRequiredRole, ORGANIZER_ALLOWED_ROLES } from "@/lib/auth";
import type { CurrentUser } from "@schemas/identity";

type RouteAuthGuardProps = {
  children: ReactNode;
  allowedRoles?: CurrentUser["role"][];
  loadingFallback?: ReactNode;
  unauthorizedFallback?: ReactNode;
};

export function RouteAuthGuard({
  children,
  allowedRoles = ORGANIZER_ALLOWED_ROLES,
  loadingFallback,
  unauthorizedFallback,
}: RouteAuthGuardProps) {
  const { data: user, isLoading } = useCurrentUserOrGuest();

  if (isLoading) {
    return <>{loadingFallback ?? <LoadingShell />}</>;
  }

  const isAllowed = hasRequiredRole(user?.role, allowedRoles);
  if (!isAllowed) {
    return <>{unauthorizedFallback ?? <UnauthorizedState />}</>;
  }

  return <>{children}</>;
}
