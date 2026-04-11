"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { STORAGE_KEYS } from "@/core/constants";
import { UI_MESSAGES } from "@/core/messages";
import {
  ApiError,
  isAuthError,
  isConflictError,
  isRetryableError,
  NetworkError,
} from "@/core/error";
import { apiClient, parseOrThrow } from "@/lib/api";
import {
  CurrentUserSchema,
  IdentityMeResponseSchema,
  type CurrentUser,
} from "@schemas/identity";

const CURRENT_USER_CACHE_KEY = `${STORAGE_KEYS.USER_SETTINGS}_current_user`;
const CURRENT_USER_CACHE_TTL_MS = 5 * 60 * 1000;

function isBrowser() {
  return typeof window !== "undefined";
}

function readCachedCurrentUser(): CurrentUser | null {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(CURRENT_USER_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as {
      expiresAt: number;
      data: CurrentUser;
    };

    if (Date.now() > parsed.expiresAt) {
      window.localStorage.removeItem(CURRENT_USER_CACHE_KEY);
      return null;
    }

    const validated = CurrentUserSchema.safeParse(parsed.data);
    if (!validated.success) {
      window.localStorage.removeItem(CURRENT_USER_CACHE_KEY);
      return null;
    }

    return validated.data;
  } catch {
    window.localStorage.removeItem(CURRENT_USER_CACHE_KEY);
    return null;
  }
}

function writeCachedCurrentUser(user: CurrentUser) {
  if (!isBrowser()) return;

  window.localStorage.setItem(
    CURRENT_USER_CACHE_KEY,
    JSON.stringify({
      data: user,
      expiresAt: Date.now() + CURRENT_USER_CACHE_TTL_MS,
    }),
  );
}

async function fetchCurrentUser(): Promise<CurrentUser> {
  try {
    const response = await apiClient.get("/identity/me");
    const parsed = parseOrThrow(IdentityMeResponseSchema, response);
    const user = parsed.data.user;

    writeCachedCurrentUser(user);
    return user;
  } catch (error) {
    if (isAuthError(error) || isConflictError(error)) {
      throw error;
    }

    if (error instanceof ApiError && !isRetryableError(error)) {
      throw error;
    }

    const cached = readCachedCurrentUser();
    if (cached) {
      return cached;
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new NetworkError(UI_MESSAGES.API.networkMessage, error);
  }
}

export const currentUserInternals = {
  CURRENT_USER_CACHE_KEY,
  CURRENT_USER_CACHE_TTL_MS,
  readCachedCurrentUser,
  writeCachedCurrentUser,
  fetchCurrentUser,
};

export function useCurrentUser(): UseQueryResult<CurrentUser, Error> {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    initialData: () => readCachedCurrentUser() ?? undefined,
    staleTime: CURRENT_USER_CACHE_TTL_MS,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: false,
  });
}

export function useCurrentUserOrGuest(): UseQueryResult<
  CurrentUser | null,
  Error
> {
  const query = useCurrentUser();

  return {
    ...query,
    data: query.data ?? null,
  } as UseQueryResult<CurrentUser | null, Error>;
}
