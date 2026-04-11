import { apiClient, parseOrThrow } from "@/lib/api";
import { ApiContractEnvelopeSchema } from "@schemas/common";
import {
  type QueueStatusQuery,
  QueueStatusResultSchema,
  type RequestAccess,
  type WaitRoomHeartbeat,
  HeartbeatResultSchema,
} from "@schemas/waitroom";
import { z } from "zod";

const QueueStatusEnvelopeSchema = ApiContractEnvelopeSchema(
  QueueStatusResultSchema,
);
const HeartbeatEnvelopeSchema = ApiContractEnvelopeSchema(
  HeartbeatResultSchema,
);

export type QueueStatusEnvelope = z.infer<typeof QueueStatusEnvelopeSchema>;
export type HeartbeatEnvelope = z.infer<typeof HeartbeatEnvelopeSchema>;

export async function requestWaitRoomAccess(
  payload: RequestAccess,
): Promise<QueueStatusEnvelope> {
  const response = await apiClient.post("/tickets/request-access", payload);
  return parseOrThrow(QueueStatusEnvelopeSchema, response);
}

export async function getWaitRoomQueueStatus(
  query: QueueStatusQuery,
): Promise<QueueStatusEnvelope> {
  const response = await apiClient.get("/tickets/queue-status", {
    params: query,
  });
  return parseOrThrow(QueueStatusEnvelopeSchema, response);
}

export async function sendWaitRoomHeartbeat(
  payload: WaitRoomHeartbeat,
): Promise<HeartbeatEnvelope> {
  const response = await apiClient.post("/tickets/heartbeat", payload);
  return parseOrThrow(HeartbeatEnvelopeSchema, response);
}
