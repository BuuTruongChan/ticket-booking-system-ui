import { describe, expect, it } from "vitest";

import { UI_MESSAGES } from "../core/messages";

function collectStringValues(input: unknown): string[] {
  if (typeof input === "string") {
    return [input];
  }

  if (!input || typeof input !== "object") {
    return [];
  }

  return Object.values(input).flatMap((value) => collectStringValues(value));
}

describe("user error copy", () => {
  it("keeps catalog event detail copy user-friendly and non-technical", () => {
    const copy = UI_MESSAGES.CATALOG_EVENT_DETAIL;

    expect(copy.title).toBeTruthy();
    expect(copy.message).toBeTruthy();
    expect(copy.retryLabel).toBeTruthy();
    expect(copy.backToEventsLabel).toBeTruthy();

    const fullCopy =
      `${copy.title} ${copy.message} ${copy.routeThrowMessage}`.toLowerCase();

    expect(fullCopy).not.toContain("stack");
    expect(fullCopy).not.toContain("exception");
    expect(fullCopy).not.toContain("sql");
    expect(fullCopy).not.toContain("trace");
    expect(fullCopy).not.toContain("internal");
  });

  it("keeps all centralized copy free from technical leakage", () => {
    const terms = [
      "stack",
      "exception",
      "sql",
      "trace",
      "internal",
      "axios",
      "http",
    ];
    const fullCopy = collectStringValues(UI_MESSAGES).join(" ").toLowerCase();

    expect(fullCopy.length).toBeGreaterThan(0);

    for (const term of terms) {
      expect(fullCopy).not.toContain(term);
    }
  });
});
