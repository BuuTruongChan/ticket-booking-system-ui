import { z } from "zod";

import { CorrelationIdSchema } from "@schemas/common";

export const RequestAccessSchema = z.object({
  eventId: z.string().min(1),
  userId: z.string().min(1),
  token: z.string().min(1).optional(),
});

export const QueueStatusQuerySchema = z.object({
  eventId: z.string().min(1),
  userId: z.string().min(1),
  token: z.string().min(1).optional(),
});

export const WaitRoomHeartbeatSchema = z.object({
  eventId: z.string().min(1),
  userId: z.string().min(1),
  token: z.string().min(1),
  correlationId: CorrelationIdSchema.optional(),
});

export type RequestAccess = z.infer<typeof RequestAccessSchema>;
export type QueueStatusQuery = z.infer<typeof QueueStatusQuerySchema>;
export type WaitRoomHeartbeat = z.infer<typeof WaitRoomHeartbeatSchema>;
