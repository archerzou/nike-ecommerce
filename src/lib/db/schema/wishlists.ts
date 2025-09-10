import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './user';
import { products } from './products';
import { z } from 'zod';

export const wishlists = pgTable('wishlists', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  addedAt: timestamp('added_at', { withTimezone: true }).notNull().defaultNow(),
});

export const wishlistsInsertSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  addedAt: z.date().optional(),
});

export const wishlistsSelectSchema = wishlistsInsertSchema.extend({
  id: z.string().uuid(),
});
