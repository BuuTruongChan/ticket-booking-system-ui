import { z } from "zod";
import {
  ApiContractEnvelopeSchema,
  ApiPagedEnvelopeSchema,
  BaseEntitySchema,
  BigIntIdSchema,
  CorrelationIdSchema,
  PaginationQuerySchema,
} from "@schemas/common";

export enum TicketStatus {
  VALID = 1,
  USED = 2,
  CANCELLED = 3,
  TRANSFERRED = 4,
}

export const TicketEntityStatusSchema = z.enum(TicketStatus);

export const TicketEntitySchema = BaseEntitySchema.extend({
  ticketCode: z.string().max(64),
  eventId: BigIntIdSchema,
  eventSeatId: BigIntIdSchema.nullable().optional(),
  orderId: BigIntIdSchema,
  ticketTypeId: BigIntIdSchema,
  userId: BigIntIdSchema,
  status: TicketEntityStatusSchema,
  transferredFromTicketId: BigIntIdSchema.nullable().optional(),
  checkedInAt: z.iso.datetime().nullable().optional(),
});

export const TicketApiStatusSchema = z.enum([
  "VALID",
  "USED",
  "CANCELLED",
  "TRANSFERRED",
]);

export const TicketListItemSchema = z.object({
  ticketId: z.string(),
  eventId: z.string(),
  eventName: z.string(),
  status: TicketApiStatusSchema,
  seatLabel: z.string(),
  sectionName: z.string(),
  holderName: z.string(),
  holderId: z.string(),
  purchasedAt: z.iso.datetime(),
  usedAt: z.iso.datetime().nullable().optional(),
});

export const TicketDetailSchema = z.object({
  ticketId: z.string(),
  eventId: z.string(),
  eventName: z.string(),
  eventDate: z.iso.datetime(),
  status: TicketApiStatusSchema,
  seatLabel: z.string(),
  sectionName: z.string(),
  rowLabel: z.string(),
  holderName: z.string(),
  holderId: z.string(),
  purchasePrice: z.number(),
  purchasedAt: z.iso.datetime(),
  usedAt: z.iso.datetime().nullable().optional(),
  transferredFrom: z.string().nullable().optional(),
});

export const TicketCheckInResultSchema = z.object({
  ticketId: z.string(),
  status: TicketApiStatusSchema.exclude(["CANCELLED", "TRANSFERRED"]),
  checkedInAt: z.iso.datetime().nullable().optional(),
});

export const TicketTransferResultSchema = z.object({
  sourceTicketId: z.string(),
  targetTicketId: z.string(),
  targetUserId: z.string(),
  transferredAt: z.iso.datetime(),
});

export const TicketLifecycleEventSchema = z.enum([
  "ISSUED",
  "USED",
  "TRANSFERRED",
  "CANCELLED",
]);

export const TicketLifecycleHistoryItemSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  event: TicketLifecycleEventSchema,
  timestamp: z.iso.datetime(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export const TicketLifecycleEntitySchema = BaseEntitySchema.extend({
  ticketId: BigIntIdSchema,
  action: z.string().max(32),
  fromStatus: TicketEntityStatusSchema.nullable().optional(),
  toStatus: TicketEntityStatusSchema.nullable().optional(),
  actorUserId: BigIntIdSchema.nullable().optional(),
  ownerUserId: BigIntIdSchema.nullable().optional(),
  targetUserId: BigIntIdSchema.nullable().optional(),
  correlationId: CorrelationIdSchema.nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export const QrTokenIssueResultSchema = z.object({
  qrToken: z.string(),
  ticketId: z.string(),
  expiresAt: z.iso.datetime(),
});

export const TicketSummarySchema = z.object({
  totalTickets: z.number().int(),
  validTickets: z.number().int(),
  usedTickets: z.number().int(),
  cancelledTickets: z.number().int(),
  transferredTickets: z.number().int(),
});

export const OrganizerEventTicketSummaryResultSchema =
  ApiContractEnvelopeSchema(TicketSummarySchema);

export const OrganizerEventTicketDetailResultSchema =
  ApiContractEnvelopeSchema(TicketDetailSchema);
export const OrganizerValidateQrResultSchema = ApiContractEnvelopeSchema(
  TicketCheckInResultSchema,
);

export const OrganizerEventTicketsQuerySchema = PaginationQuerySchema.extend({
  page: PaginationQuerySchema.shape.page.default(1),
  limit: PaginationQuerySchema.shape.limit.default(20),
});

export const OrganizerEventTicketsPagedResultSchema =
  ApiPagedEnvelopeSchema(TicketListItemSchema);

export type TicketListItem = z.infer<typeof TicketListItemSchema>;
export type TicketDetail = z.infer<typeof TicketDetailSchema>;
export type TicketEntity = z.infer<typeof TicketEntitySchema>;
export type OrganizerEventTicketSummaryResult = z.infer<
  typeof OrganizerEventTicketSummaryResultSchema
>;
export type OrganizerEventTicketDetailResult = z.infer<
  typeof OrganizerEventTicketDetailResultSchema
>;
export type OrganizerValidateQrResult = z.infer<
  typeof OrganizerValidateQrResultSchema
>;
export type OrganizerEventTicketsQuery = z.infer<
  typeof OrganizerEventTicketsQuerySchema
>;
export type OrganizerEventTicketsPagedResult = z.infer<
  typeof OrganizerEventTicketsPagedResultSchema
>;
