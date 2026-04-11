import { describe, expect, it } from "vitest";

import { ORGANIZER_ALLOWED_ROLES, hasRequiredRole } from "./route-access";

describe("route-access", () => {
  it("allows organizer-facing roles", () => {
    expect(hasRequiredRole("ORGANIZER", ORGANIZER_ALLOWED_ROLES)).toBe(true);
    expect(hasRequiredRole("ADMIN", ORGANIZER_ALLOWED_ROLES)).toBe(true);
    expect(hasRequiredRole("SUPER_ADMIN", ORGANIZER_ALLOWED_ROLES)).toBe(true);
  });

  it("denies guest and non-organizer roles", () => {
    expect(hasRequiredRole("USER", ORGANIZER_ALLOWED_ROLES)).toBe(false);
    expect(hasRequiredRole(null, ORGANIZER_ALLOWED_ROLES)).toBe(false);
    expect(hasRequiredRole(undefined, ORGANIZER_ALLOWED_ROLES)).toBe(false);
  });

  it("denies roles not present in the allowed list", () => {
    expect(hasRequiredRole("USER", ["ADMIN"])).toBe(false);
    expect(hasRequiredRole("ADMIN", ["ORGANIZER"])).toBe(false);
  });
});
