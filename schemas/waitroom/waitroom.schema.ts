import { z } from "zod";

export const QueueStatusSchema = z.enum([
  "NOT_OPEN",
  "ADMITTED",
  "QUEUEING",
  "LOST_SESSION",
]);

export const QueueStatusResultSchema = z.object({
  status: QueueStatusSchema,
  token: z.string().optional(),
  position: z.number().int().optional(),
  estimatedWaitTime: z.number().int().optional(),
  eventId: z.string(),
  userId: z.string(),
});

export const HeartbeatResultSchema = z.object({
  eventId: z.string(),
  userId: z.string(),
  heartbeatRecordedAt: z.iso.datetime(),
  sessionExpiresIn: z.number().int(),
});

export type QueueStatusResult = z.infer<typeof QueueStatusResultSchema>;
export type HeartbeatResult = z.infer<typeof HeartbeatResultSchema>;
