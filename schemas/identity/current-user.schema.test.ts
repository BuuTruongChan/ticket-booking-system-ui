import { describe, expect, it } from "vitest";

import { IdentityMeResponseSchema } from "./current-user.schema";

describe("IdentityMeResponseSchema", () => {
  it("parses a valid identity payload", () => {
    const result = IdentityMeResponseSchema.parse({
      success: true,
      data: {
        msg: "worked.",
        user: {
          id: "user123",
          role: "USER",
        },
      },
      timestamp: "2026-04-08T10:00:00Z",
    });

    expect(result.data.user.id).toBe("user123");
    expect(result.data.user.role).toBe("USER");
  });

  it("rejects payload with invalid role", () => {
    const result = IdentityMeResponseSchema.safeParse({
      success: true,
      data: {
        msg: "worked.",
        user: {
          id: "user123",
          role: "GUEST",
        },
      },
    });

    expect(result.success).toBe(false);
  });
});
