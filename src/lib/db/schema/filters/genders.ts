import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const genders = pgTable('genders', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: text('label').notNull(),
  slug: text('slug').notNull().unique(),
});

export const genderInsertSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1),
  slug: z.string().min(1),
});

export const genderSelectSchema = genderInsertSchema.extend({
  id: z.string().uuid(),
});
