"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_MESSAGES } from "@/core/messages";

type EventDetailErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function EventDetailError({
  error: _error,
  reset,
}: EventDetailErrorProps) {
  const copy = UI_MESSAGES.CATALOG_EVENT_DETAIL;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>{copy.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{copy.message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => reset()}>
              {copy.retryLabel}
            </Button>
            <Link href="/">
              <Button variant="ghost">{copy.backToEventsLabel}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
