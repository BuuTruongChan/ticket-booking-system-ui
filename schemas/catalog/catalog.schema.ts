import { z } from "zod";
import { BigIntIdSchema, SoftDeletableBaseEntitySchema } from "@schemas/common";

export const VenueSectionTypeSchema = z.enum(["RESERVED", "GA", "STANDING"]);

export const SeatQualitySchema = z.enum(["STANDARD", "PREMIUM", "VIP"]);

export const VenueSchema = SoftDeletableBaseEntitySchema.extend({
  venueCode: z.string().max(32),
  venueName: z.string().max(255),
  address: z.string().max(255).nullable().optional(),
  city: z.string().max(120).nullable().optional(),
  country: z.string().max(120).nullable().optional(),
  latitude: z.string().nullable().optional(),
  longitude: z.string().nullable().optional(),
  capacity: z.number().int().min(0).default(0),
  mapSvg: z.string().nullable().optional(),
  mapImageUrl: z.string().url().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),

  // Legacy/read-model aliases from older APIs
  name: z.string().optional(),
  location: z.string().optional(),
});

export const VenueSectionSchema = SoftDeletableBaseEntitySchema.extend({
  venueId: BigIntIdSchema,
  sectionCode: z.string().max(64),
  sectionName: z.string().max(255),
  sectionType: VenueSectionTypeSchema.default("RESERVED"),
  capacity: z.number().int().min(0).default(0),
  sortOrder: z.number().int().default(0),

  // Legacy/read-model aliases from older APIs
  name: z.string().optional(),
  type: VenueSectionTypeSchema.optional(),
});

export const VenueRowSchema = SoftDeletableBaseEntitySchema.extend({
  sectionId: BigIntIdSchema,
  rowLabel: z.string().max(32),
  sortOrder: z.number().int().default(0),
});

export const VenueSeatSchema = SoftDeletableBaseEntitySchema.extend({
  venueId: BigIntIdSchema,
  sectionId: BigIntIdSchema,
  rowId: BigIntIdSchema.nullable().optional(),
  seatLabel: z.string(),
  seatNumber: z.number().int().nullable().optional(),
  isAccessible: z.boolean().default(false),
  quality: SeatQualitySchema.default("STANDARD"),
  sortOrder: z.number().int().default(0),

  // Projection fields
  rowLabel: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

export type Venue = z.infer<typeof VenueSchema>;
export type VenueSection = z.infer<typeof VenueSectionSchema>;
export type VenueRow = z.infer<typeof VenueRowSchema>;
export type VenueSeat = z.infer<typeof VenueSeatSchema>;
