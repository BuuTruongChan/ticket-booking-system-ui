import type { CurrentUser } from "@schemas/identity";

export const ORGANIZER_ALLOWED_ROLES: CurrentUser["role"][] = [
  "ORGANIZER",
  "ADMIN",
  "SUPER_ADMIN",
];

export function hasRequiredRole(
  userRole: CurrentUser["role"] | null | undefined,
  allowedRoles: CurrentUser["role"][],
): boolean {
  return Boolean(userRole && allowedRoles.includes(userRole));
}
