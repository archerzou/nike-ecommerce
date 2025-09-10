import { pgTable, uuid, text, numeric, integer, real, jsonb, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';
import { colors } from './filters/colors';
import { sizes } from './filters/sizes';
import { z } from 'zod';

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  sku: text('sku').notNull().unique(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric('sale_price', { precision: 10, scale: 2 }),
  colorId: uuid('color_id').notNull().references(() => colors.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  sizeId: uuid('size_id').notNull().references(() => sizes.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  inStock: integer('in_stock').notNull().default(0),
  weight: real('weight'),
  dimensions: jsonb('dimensions'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  uqProductColorSize: uniqueIndex('uq_product_variant_color_size').on(t.productId, t.colorId, t.sizeId),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  color: one(colors, {
    fields: [productVariants.colorId],
    references: [colors.id],
  }),
  size: one(sizes, {
    fields: [productVariants.sizeId],
    references: [sizes.id],
  }),
}));

export const productVariantInsertSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  sku: z.string().min(1),
  price: z.string(),
  salePrice: z.string().optional().nullable(),
  colorId: z.string().uuid(),
  sizeId: z.string().uuid(),
  inStock: z.number().int().min(0).default(0),
  weight: z.number().optional().nullable(),
  dimensions: z.record(z.any()).optional().nullable(),
  createdAt: z.date().optional(),
});

export const productVariantSelectSchema = productVariantInsertSchema.extend({
  id: z.string().uuid(),
});
