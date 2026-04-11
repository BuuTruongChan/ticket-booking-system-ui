import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError, NetworkError, UnauthorizedError } from "@/core/error";
import { currentUserInternals } from "@/hooks/user/useCurrentUser";
import { apiClient } from "@/lib/api";

type StorageMap = Record<string, string>;

function createLocalStorageMock(seed: StorageMap = {}) {
  const store: StorageMap = { ...seed };

  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
  };
}

describe("fetchCurrentUser", () => {
  const mockGet = vi.spyOn(apiClient, "get");

  beforeEach(() => {
    vi.clearAllMocks();

    const localStorage = createLocalStorageMock();
    Object.defineProperty(globalThis, "window", {
      value: { localStorage },
      configurable: true,
      writable: true,
    });
  });

  it("returns parsed user from API and caches it", async () => {
    mockGet.mockResolvedValueOnce({
      success: true,
      data: {
        msg: "worked.",
        user: {
          id: "user123",
          role: "USER",
        },
      },
    });

    const user = await currentUserInternals.fetchCurrentUser();

    expect(user).toEqual({ id: "user123", role: "USER" });

    const cachedRaw = globalThis.window.localStorage.getItem(
      currentUserInternals.CURRENT_USER_CACHE_KEY,
    );
    expect(cachedRaw).toBeTruthy();
  });

  it("throws auth errors without fallback override", async () => {
    mockGet.mockRejectedValueOnce(new UnauthorizedError("Unauthorized"));

    await expect(
      currentUserInternals.fetchCurrentUser(),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("returns cached user on retryable API failures", async () => {
    const cachedUser = { id: "offline-user", role: "USER" };

    globalThis.window.localStorage.setItem(
      currentUserInternals.CURRENT_USER_CACHE_KEY,
      JSON.stringify({
        data: cachedUser,
        expiresAt: Date.now() + currentUserInternals.CURRENT_USER_CACHE_TTL_MS,
      }),
    );

    mockGet.mockRejectedValueOnce(
      new ApiError("Server error", 500, "INTERNAL"),
    );

    await expect(currentUserInternals.fetchCurrentUser()).resolves.toEqual(
      cachedUser,
    );
  });

  it("throws NetworkError when unknown failure occurs and cache is missing", async () => {
    mockGet.mockRejectedValueOnce({ bad: "shape" });

    await expect(
      currentUserInternals.fetchCurrentUser(),
    ).rejects.toBeInstanceOf(NetworkError);
  });
});
