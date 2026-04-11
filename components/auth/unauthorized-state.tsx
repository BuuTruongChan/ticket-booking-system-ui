import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UI_MESSAGES } from "@/core/messages";

type UnauthorizedStateProps = {
  title?: string;
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function UnauthorizedState({
  title = UI_MESSAGES.AUTH.unauthorizedTitle,
  message = UI_MESSAGES.AUTH.unauthorizedMessage,
  ctaLabel = UI_MESSAGES.COMMON.backToHomeLabel,
  ctaHref = "/",
}: UnauthorizedStateProps) {
  return (
    <section
      data-agent-type="state-display"
      data-entity-type="authorization"
      data-state-keys="denied"
      className="rounded-2xl border border-border/60 bg-background/80 p-6"
    >
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <div className="mt-4">
        <Link href={ctaHref}>
          <Button variant="outline">{ctaLabel}</Button>
        </Link>
      </div>
    </section>
  );
}
