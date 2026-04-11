const WAITROOM_TOKEN_PREFIX = "WAITROOM_TOKEN";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getWaitRoomTokenStorageKey(eventId: string, userId: string) {
  return `${WAITROOM_TOKEN_PREFIX}_${eventId}_${userId}`;
}

export function readWaitRoomToken(
  eventId: string,
  userId: string,
): string | null {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(
    getWaitRoomTokenStorageKey(eventId, userId),
  );
}

export function writeWaitRoomToken(
  eventId: string,
  userId: string,
  token: string,
) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    getWaitRoomTokenStorageKey(eventId, userId),
    token,
  );
}

export function clearWaitRoomToken(eventId: string, userId: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(getWaitRoomTokenStorageKey(eventId, userId));
}
