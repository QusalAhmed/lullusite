import { pgTable, uuid, varchar, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// helper
import timestamp from "@/db/columns.helpers";

// local
import {user} from "@/db/index.schema";

export const webhookTable = pgTable('webhooks', {
    id: uuid('id').defaultRandom().primaryKey(),
    type: varchar('type', { length: 50 }).notNull(),
    merchantId: varchar('merchant_id', { length: 100 }).notNull().references(() => user.id),
    payload: jsonb('payload').notNull(),

    ...timestamp,
});

export const webhookRelations = relations(webhookTable, ({ one }) => ({
    merchant: one(user, {
        fields: [webhookTable.merchantId],
        references: [user.id],
    }),
}));