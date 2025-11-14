import { pgTable, text, uuid, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Schema
import {user} from "./index.schema"

// Helper
import timestamps from './columns.helpers'

export const pageTable = pgTable('page', {
    id: uuid().primaryKey().defaultRandom(),
    userId: text("user_id").references(() =>
            user.id,
        {
            onDelete: "cascade",
            onUpdate: "cascade"
        }
    ).notNull(),
    slug: text('slug').notNull(),
    status: boolean('status').notNull().default(true),

    ...timestamps
});

export type Page = typeof pageTable.$inferSelect;

export const pageRelations = relations(pageTable, ({one}) => ({
    user: one(user, {
        fields: [pageTable.userId],
        references: [user.id]
    })
}));