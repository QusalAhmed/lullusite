import { integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "../../auth-schema";
import timestamps from "@/db/columns.helpers";
import { relations } from "drizzle-orm";
import { categoriesTable, productImageTable } from "@/db/index.schema";

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
    width: integer("width"),
    height: integer("height"),
    size: integer("size"),    // Size in kb
    hash: text().notNull().unique(),

    ...timestamps
});

export const imageRelations = relations(imageTable, ({ one, many }) => ({
    category: one(categoriesTable, {
        fields: [imageTable.id],
        references: [categoriesTable.image]
    }),
    product: many(productImageTable),
    // user: many(user)
}));
