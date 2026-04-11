"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { waitRoomQueryKeys } from "@/features/waitroom";
import {
  clearWaitRoomToken,
  readWaitRoomToken,
  writeWaitRoomToken,
} from "@/lib/waitroom/session-token";
import {
  getWaitRoomQueueStatus,
  requestWaitRoomAccess,
  sendWaitRoomHeartbeat,
} from "@/services/waitroom.service";
import type { QueueStatusResult } from "@schemas/waitroom";

const HEARTBEAT_INTERVAL_MS = 5000;

export function useWaitRoomStatus(eventId?: string, userId?: string) {
  const queryClient = useQueryClient();
  const storedToken =
    eventId && userId ? readWaitRoomToken(eventId, userId) : null;

  const statusQuery = useQuery({
    queryKey:
      eventId && userId
        ? waitRoomQueryKeys.status(eventId, userId, storedToken)
        : [...waitRoomQueryKeys.all, "status", "disabled"],
    queryFn: () =>
      getWaitRoomQueueStatus({
        eventId: eventId as string,
        userId: userId as string,
        token: storedToken ?? undefined,
      }),
    enabled: Boolean(eventId && userId && storedToken),
    refetchInterval: (query) => {
      const status = query.state.data?.data.status;
      return status === "QUEUEING" ? HEARTBEAT_INTERVAL_MS : false;
    },
    staleTime: 0,
  });

  const requestAccessMutation = useMutation({
    mutationFn: () =>
      requestWaitRoomAccess({
        eventId: eventId as string,
        userId: userId as string,
        token: storedToken ?? undefined,
      }),
    onSuccess: (result) => {
      const nextToken = result.data.token;
      if (eventId && userId && nextToken) {
        writeWaitRoomToken(eventId, userId, nextToken);
      }

      if (eventId && userId) {
        queryClient.setQueryData(
          waitRoomQueryKeys.status(eventId, userId, nextToken ?? storedToken),
          result,
        );
      }
    },
  });

  const heartbeatMutation = useMutation({
    mutationFn: () =>
      sendWaitRoomHeartbeat({
        eventId: eventId as string,
        userId: userId as string,
        token: storedToken as string,
      }),
  });

  const activeStatus =
    statusQuery.data?.data ?? requestAccessMutation.data?.data;

  useEffect(() => {
    const status = activeStatus?.status;
    if (!eventId || !userId || !storedToken || status !== "ADMITTED") {
      return;
    }

    const intervalId = window.setInterval(() => {
      heartbeatMutation.mutate();
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeStatus?.status, eventId, heartbeatMutation, storedToken, userId]);

  function resetWaitRoomSession() {
    if (!eventId || !userId) {
      return;
    }

    clearWaitRoomToken(eventId, userId);
    queryClient.removeQueries({
      queryKey: waitRoomQueryKeys.status(eventId, userId, null),
    });
  }

  return {
    status: activeStatus as QueueStatusResult | undefined,
    token: storedToken,
    hasRequested: Boolean(
      requestAccessMutation.data || statusQuery.data || storedToken,
    ),
    isStatusLoading: statusQuery.isLoading,
    isStatusFetching: statusQuery.isFetching,
    isStatusError: statusQuery.isError,
    requestAccess: () => requestAccessMutation.mutate(),
    refreshStatus: () => statusQuery.refetch(),
    resetWaitRoomSession,
    isRequestingAccess: requestAccessMutation.isPending,
    isRequestError: requestAccessMutation.isError,
    isSendingHeartbeat: heartbeatMutation.isPending,
  };
}
