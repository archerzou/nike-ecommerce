import { pgTable, text, uuid, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';
import { productVariants } from './variants';
import { colors } from './filters/colors';
import { z } from 'zod';

export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'set null', onUpdate: 'cascade' }),
  url: text('url').notNull(),
  colorId: uuid('color_id').references(() => colors.id, { onDelete: 'set null', onUpdate: 'cascade' }),
  sortOrder: integer('sort_order').notNull().default(0),
  isPrimary: boolean('is_primary').notNull().default(false),
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [productImages.variantId],
    references: [productVariants.id],
  }),
  color: one(colors, {
    fields: [productImages.colorId],
    references: [colors.id],
  }),
}));

export const productImageInsertSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  variantId: z.string().uuid().nullable().optional(),
  url: z.string().min(1),
  colorId: z.string().uuid().nullable().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isPrimary: z.boolean().default(false),
});

export const productImageSelectSchema = productImageInsertSchema.extend({
  id: z.string().uuid(),
});
