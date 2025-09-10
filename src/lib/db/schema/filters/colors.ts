import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const colors = pgTable('colors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  hexCode: text('hex_code').notNull(),
});

export const colorInsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  hexCode: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
});

export const colorSelectSchema = colorInsertSchema.extend({
  id: z.string().uuid(),
});
