"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_MESSAGES } from "@/core/messages";
import { useCurrentUserOrGuest } from "@/hooks/user";
import { useWaitRoomStatus } from "@/hooks/waitroom";

type WaitRoomEntryCardProps = {
  eventId: string;
};

export function WaitRoomEntryCard({ eventId }: WaitRoomEntryCardProps) {
  const { data: user } = useCurrentUserOrGuest();
  const {
    status,
    token,
    isStatusLoading,
    isStatusFetching,
    isRequestingAccess,
    isRequestError,
    requestAccess,
    refreshStatus,
    resetWaitRoomSession,
  } = useWaitRoomStatus(eventId, user?.id);
  const waitRoomErrorCopy = UI_MESSAGES.WAIT_ROOM;

  if (!user?.id) {
    return (
      <Card
        className="mt-6"
        data-agent-type="state-display"
        data-entity-type="waitroom-card"
        data-entity-id={eventId}
        data-state-keys="guest"
      >
        <CardHeader>
          <CardTitle className="text-base">Wait room access</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sign in to request queue access for this event.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="mt-6"
      data-agent-type="state-display"
      data-entity-type="waitroom-card"
      data-entity-id={eventId}
      data-state-keys="status,position,estimatedWaitTime"
    >
      <CardHeader>
        <CardTitle className="text-base">Wait room access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {status ? (
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={
                status.status === "ADMITTED"
                  ? "success"
                  : status.status === "LOST_SESSION"
                    ? "warning"
                    : "info"
              }
            >
              {status.status.replaceAll("_", " ")}
            </Badge>
            {typeof status.position === "number" ? (
              <span className="text-xs text-muted-foreground">
                Position: {status.position}
              </span>
            ) : null}
            {typeof status.estimatedWaitTime === "number" ? (
              <span className="text-xs text-muted-foreground">
                ETA: {status.estimatedWaitTime}s
              </span>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Not in queue yet.</p>
        )}

        {status?.status === "QUEUEING" ? (
          <p className="text-xs text-muted-foreground">
            You are in queue. We refresh your position automatically.
          </p>
        ) : null}

        {status?.status === "LOST_SESSION" ? (
          <p className="text-xs text-muted-foreground">
            Session expired. Rejoin the queue to continue.
          </p>
        ) : null}

        {status?.status === "ADMITTED" ? (
          <p className="text-xs text-muted-foreground">
            You are admitted. Keep this tab open to maintain access.
          </p>
        ) : null}

        {isStatusLoading ? (
          <p className="text-xs text-muted-foreground">
            Checking queue status...
          </p>
        ) : null}

        {isStatusFetching && !isStatusLoading ? (
          <p className="text-xs text-muted-foreground">
            Refreshing queue status...
          </p>
        ) : null}

        {isRequestError ? (
          <p className="text-xs text-destructive">
            {waitRoomErrorCopy.requestAccessError}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={requestAccess}
            disabled={isRequestingAccess}
            variant="outline"
            data-agent-type="action"
            data-entity-type="waitroom-request-access"
            data-entity-id={eventId}
            data-mutation-trigger="request-access"
          >
            {isRequestingAccess
              ? "Requesting..."
              : status?.status === "LOST_SESSION"
                ? "Rejoin queue"
                : "Request queue access"}
          </Button>

          <Button
            type="button"
            onClick={() => void refreshStatus()}
            variant="ghost"
            data-agent-type="action"
            data-entity-type="waitroom-refresh-status"
            data-entity-id={eventId}
            data-mutation-trigger="refresh-status"
          >
            Refresh status
          </Button>

          {token ? (
            <Button
              type="button"
              onClick={resetWaitRoomSession}
              variant="ghost"
              data-agent-type="action"
              data-entity-type="waitroom-reset-session"
              data-entity-id={eventId}
              data-mutation-trigger="reset-session"
            >
              Reset session
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
