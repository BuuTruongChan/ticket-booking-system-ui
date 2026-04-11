"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UI_MESSAGES } from "@/core/messages";
import { validateOrganizerTicketQr } from "@/services/organizer.service";

type OrganizerTicketQrValidationActionProps = {
  eventId: string;
};

export function OrganizerTicketQrValidationAction({
  eventId,
}: OrganizerTicketQrValidationActionProps) {
  const [qrToken, setQrToken] = useState("");
  const organizerErrorCopy = UI_MESSAGES.ORGANIZER;

  const mutation = useMutation({
    mutationFn: (token: string) =>
      validateOrganizerTicketQr(eventId, {
        qrToken: token,
      }),
    onSuccess: (result) => {
      toast.success("QR validated", {
        description: `Ticket ${result.data.ticketId} status: ${result.data.status}`,
      });
    },
    onError: () => {
      toast.error(organizerErrorCopy.qrValidateErrorTitle, {
        description: organizerErrorCopy.qrValidateErrorDescription,
      });
    },
  });

  return (
    <section
      className="mt-6 rounded-xl border border-border/60 bg-background/70 p-4"
      data-agent-type="state-display"
      data-entity-type="qr-validation"
      data-state-keys="status"
    >
      <p className="mb-3 text-sm font-medium text-foreground">
        Validate QR token
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={qrToken}
          onChange={(event) => setQrToken(event.target.value)}
          placeholder="Paste ticket QR token"
          data-entity-type="qr-token-input"
        />
        <Button
          type="button"
          disabled={!qrToken.trim() || mutation.isPending}
          onClick={() => mutation.mutate(qrToken.trim())}
        >
          {mutation.isPending ? "Validating..." : "Validate QR"}
        </Button>
      </div>

      {mutation.isIdle ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Enter a QR token and validate against organizer endpoint.
        </p>
      ) : null}

      {mutation.isSuccess ? (
        <p className="mt-2 text-xs text-emerald-600">
          Validated ticket {mutation.data.data.ticketId} (
          {mutation.data.data.status})
        </p>
      ) : null}

      {mutation.isError ? (
        <p className="mt-2 text-xs text-destructive">
          {organizerErrorCopy.qrValidateInlineError}
        </p>
      ) : null}
    </section>
  );
}
