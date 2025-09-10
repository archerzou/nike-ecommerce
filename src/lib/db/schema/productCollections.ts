import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';
import { collections } from './collections';
import { z } from 'zod';

export const productCollections = pgTable('product_collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  collectionId: uuid('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
});

export const productCollectionsRelations = relations(productCollections, ({ one }) => ({
  product: one(products, {
    fields: [productCollections.productId],
    references: [products.id],
  }),
  collection: one(collections, {
    fields: [productCollections.collectionId],
    references: [collections.id],
  }),
}));

export const productCollectionInsertSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  collectionId: z.string().uuid(),
});

export const productCollectionSelectSchema = productCollectionInsertSchema.extend({
  id: z.string().uuid(),
});
