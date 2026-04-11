export const waitRoomQueryKeys = {
  all: ["waitRoom"] as const,
  status: (eventId: string, userId: string, token?: string | null) =>
    [
      ...waitRoomQueryKeys.all,
      "status",
      { eventId, userId, token: token ?? null },
    ] as const,
};
