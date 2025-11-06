import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";

// Local
import { user } from "@/db/index.schema";

// Helper
import timestamps from "./columns.helpers";

export const categories = pgTable("categories", {
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
            image.id,
        {
            onDelete: "cascade",
            onUpdate: "cascade"
        }
    ),
    url: varchar("url", {length: 2048}),

    ...timestamps
});

export const image = pgTable("image", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() =>
            user.id,
        {
            onDelete: "cascade",
            onUpdate: "cascade"
        }
    ).notNull(),
    url: varchar("url", {length: 2048}).notNull(),
    altText: varchar("alt_text", {length: 512}),
    width: varchar("width", {length: 10}),
    height: varchar("height", {length: 10}),
    size: varchar("size", {length: 20}),    // Size in kb

    ...timestamps
});