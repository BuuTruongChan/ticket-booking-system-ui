import { z } from "zod";

import { CorrelationIdSchema } from "@schemas/common";

export const TicketCheckInRequestSchema = z.object({
  ticketId: z.string().min(1),
  correlationId: CorrelationIdSchema.optional(),
});

export const TicketTransferRequestSchema = z.object({
  targetUserId: z.string().min(1),
  correlationId: CorrelationIdSchema.optional(),
});

export const TicketByIdQuerySchema = z.object({
  ticketId: z.string().min(1),
});

export const OrganizerValidateQrRequestSchema = z.object({
  qrToken: z.string().min(1),
  correlationId: CorrelationIdSchema.optional(),
});

export type TicketCheckInRequest = z.infer<typeof TicketCheckInRequestSchema>;
export type TicketTransferRequest = z.infer<typeof TicketTransferRequestSchema>;
export type TicketByIdQuery = z.infer<typeof TicketByIdQuerySchema>;
export type OrganizerValidateQrRequest = z.infer<
  typeof OrganizerValidateQrRequestSchema
>;
