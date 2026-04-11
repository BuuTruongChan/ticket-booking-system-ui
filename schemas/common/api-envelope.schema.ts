import { z } from "zod";

export const ApiPaginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
});

export type ApiPagination = z.infer<typeof ApiPaginationSchema>;

export const ApiContractEnvelopeSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
    timestamp: z.iso.datetime().optional(),
  });

export const ApiPagedEnvelopeSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.array(itemSchema),
    pagination: ApiPaginationSchema,
    message: z.string().optional(),
    timestamp: z.iso.datetime().optional(),
  });

export const ApiBaseErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    timestamp: z.iso.datetime(),
  }),
});

export type ApiBaseError = z.infer<typeof ApiBaseErrorSchema>;
