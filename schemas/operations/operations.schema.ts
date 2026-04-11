import { z } from "zod";

const OperationsStatusSchema = z.enum(["UP", "DEGRADED"]);
const OperationsErrorItemSchema = z.record(z.string(), z.unknown());

export const OperationsWaitRoomStatusSchema = z.object({
  component: z.string(),
  status: OperationsStatusSchema,
  eventId: z.string().optional(),
  activeUserCount: z.number().int().optional(),
  queuedUserCount: z.number().int().optional(),
  capacity: z.number().int().optional(),
  lobbyOpenUntil: z.iso.datetime().optional(),
  lastUpdated: z.iso.datetime().optional(),
  errors: z.array(OperationsErrorItemSchema).optional(),
});

export const OperationsPaymentStatusSchema = z.object({
  component: z.string(),
  status: OperationsStatusSchema,
  pendingTransactions: z.number().int().optional(),
  failedTransactions: z.number().int().optional(),
  redisAvailable: z.boolean().optional(),
  databaseAvailable: z.boolean().optional(),
  lastUpdated: z.iso.datetime().optional(),
  errors: z.array(OperationsErrorItemSchema).optional(),
});

export const OperationsReaperStatusSchema = z.object({
  component: z.string(),
  status: OperationsStatusSchema,
  lastExecuted: z.iso.datetime().optional(),
  executionDuration: z.number().int().optional(),
  expiredReservations: z.number().int().optional(),
  releasedSeats: z.number().int().optional(),
  errors: z.array(OperationsErrorItemSchema).optional(),
});

export const OperationsProtectionStatusSchema = z.object({
  component: z.string(),
  status: OperationsStatusSchema,
  enabled: z.boolean().optional(),
  failClosed: z.boolean().optional(),
  allowedTiers: z.array(z.string()).optional(),
  routeOverrides: z.record(z.string(), z.unknown()).optional(),
});

export type OperationsWaitRoomStatus = z.infer<
  typeof OperationsWaitRoomStatusSchema
>;
export type OperationsPaymentStatus = z.infer<
  typeof OperationsPaymentStatusSchema
>;
