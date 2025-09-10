import { pgEnum, pgTable, uuid, timestamp, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { orders } from './orders';
import { z } from 'zod';

export const paymentMethodEnum = pgEnum('payment_method', ['stripe', 'paypal', 'cod']);
export const paymentStatusEnum = pgEnum('payment_status', ['initiated', 'completed', 'failed']);

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  method: paymentMethodEnum('method').notNull(),
  status: paymentStatusEnum('status').notNull().default('initiated'),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  transactionId: text('transaction_id'),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const paymentInsertSchema = z.object({
  id: z.string().uuid().optional(),
  orderId: z.string().uuid(),
  method: z.enum(['stripe', 'paypal', 'cod']),
  status: z.enum(['initiated', 'completed', 'failed']).default('initiated'),
  paidAt: z.date().optional().nullable(),
  transactionId: z.string().optional().nullable(),
});

export const paymentSelectSchema = paymentInsertSchema.extend({
  id: z.string().uuid(),
});
