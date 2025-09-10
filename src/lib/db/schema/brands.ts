import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logoUrl: text('logo_url'),
});

export const brandInsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  logoUrl: z.string().url().optional().nullable(),
});

export const brandSelectSchema = brandInsertSchema.extend({
  id: z.string().uuid(),
});
