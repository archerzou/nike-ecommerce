import { pgEnum, pgTable, uuid, text, numeric, timestamp, integer } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const discountTypeEnum = pgEnum('discount_type', ['percentage', 'fixed']);

export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  discountType: discountTypeEnum('discount_type').notNull(),
  discountValue: numeric('discount_value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  maxUsage: integer('max_usage').notNull().default(0),
  usedCount: integer('used_count').notNull().default(0),
});

export const couponInsertSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.string(),
  expiresAt: z.date().optional().nullable(),
  maxUsage: z.number().int().min(0).default(0),
  usedCount: z.number().int().min(0).default(0),
});

export const couponSelectSchema = couponInsertSchema.extend({
  id: z.string().uuid(),
});
