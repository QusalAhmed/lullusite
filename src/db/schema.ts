import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

// Local
import { user } from "@/db/index.schema";

// Helper
import timestamps from "./columns.helpers";

export const categoriesTable = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() =>
            user.id,
        {
            onDelete: "cascade",
            onUpdate: "cascade"
        }
    ).notNull(),
    name: varchar("name", {length: 255}).notNull(),
    description: varchar("description", {length: 1024}),
    image: uuid('image_id').references(() =>
            imageTable.id,
        {
            onDelete: "cascade",
            onUpdate: "cascade"
        }
    ),

    ...timestamps
});

export const categoryRelations = relations(categoriesTable, ({ one }) => ({
    image: one(imageTable, {
        fields: [categoriesTable.image],
        references: [imageTable.id]
    })
}));

export const imageTable = pgTable("image", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() =>
            user.id,
        {
            onDelete: "cascade",
            onUpdate: "cascade"
        }
    ).notNull(),
    url: varchar("url", {length: 2048}).notNull(),
    thumbnailUrl: varchar("thumbnail_url", {length: 2048}),
    altText: varchar("alt_text", {length: 512}),
    width: varchar("width", {length: 10}),
    height: varchar("height", {length: 10}),
    size: varchar("size", {length: 20}),    // Size in kb
    hash: text().notNull().unique(),

    ...timestamps
});

export const imageRelations = relations(imageTable, ({ one }) => ({
    category: one(categoriesTable, {
        fields: [imageTable.id],
        references: [categoriesTable.image]
    })
}));