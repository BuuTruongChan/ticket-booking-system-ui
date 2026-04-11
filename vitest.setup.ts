import { vi } from "vitest";

const restoreAllMocks = vi.restoreAllMocks.bind(vi);

vi.restoreAllMocks = () => {
  // Keep active spies attached for legacy tests that store spy handles once.
  vi.clearAllMocks();
  return vi;
};

// Expose original restore in case a test explicitly needs full restore.
(
  globalThis as { __restoreAllMocks?: typeof restoreAllMocks }
).__restoreAllMocks = restoreAllMocks;
