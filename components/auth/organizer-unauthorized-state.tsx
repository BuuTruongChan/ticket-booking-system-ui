import { UnauthorizedState } from "@/components/auth/unauthorized-state";
import { UI_MESSAGES } from "@/core/messages";

export function OrganizerUnauthorizedState() {
  return (
    <UnauthorizedState
      title={UI_MESSAGES.AUTH.organizerUnauthorizedTitle}
      message={UI_MESSAGES.AUTH.organizerUnauthorizedMessage}
      ctaLabel={UI_MESSAGES.AUTH.browseEventsLabel}
      ctaHref="/"
    />
  );
}
