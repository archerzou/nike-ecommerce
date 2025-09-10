import { pgTable, text, uuid, integer } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const sizes = pgTable('sizes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const sizeInsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  sortOrder: z.number().int().min(0).default(0),
});

export const sizeSelectSchema = sizeInsertSchema.extend({
  id: z.string().uuid(),
});
