"use client";

import type { ReactNode } from "react";

import { hasRequiredRole, ORGANIZER_ALLOWED_ROLES } from "@/lib/auth";
import type { CurrentUser } from "@schemas/identity";

const DEFAULT_ALLOWED_ROLES = ORGANIZER_ALLOWED_ROLES;

type RoleGateProps = {
  userRole?: CurrentUser["role"] | null;
  allowedRoles?: CurrentUser["role"][];
  children: ReactNode;
  fallback?: ReactNode;
};

export function RoleGate({
  userRole,
  allowedRoles = DEFAULT_ALLOWED_ROLES,
  children,
  fallback = null,
}: RoleGateProps) {
  const isAllowed = hasRequiredRole(userRole, allowedRoles);

  return (
    <>
      <div
        data-agent-type="state-display"
        data-entity-type="permission-gate"
        data-state-keys="userRole,allowedRoles,isAllowed"
        data-permission-required={allowedRoles.join("|")}
        data-permission-available={userRole ?? "GUEST"}
        data-permission-result={isAllowed ? "allowed" : "denied"}
        hidden
      />
      {isAllowed ? children : fallback}
    </>
  );
}
