import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Local
import { user, imageTable } from "@/db/index.schema";

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

export const categoryRelations = relations(categoriesTable, ({one, many}) => ({
    image: one(imageTable, {
        fields: [categoriesTable.image],
        references: [imageTable.id]
    }),
    subCategories: many(subCategoriesTable)
}));

export const subCategoriesTable = pgTable("sub_categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id").references(() =>
            categoriesTable.id,
        {
            onDelete: "cascade",
            onUpdate: "cascade"
        }
    ).notNull(),
    userId: text("user_id").references(() =>
            user.id,
        {
            onDelete: "cascade",
            onUpdate: "cascade"
        }
    ).notNull(),
    name: varchar("name", {length: 255}).notNull(),
    description: varchar("description", {length: 1024}),

    ...timestamps
});

export const subCategoryRelations = relations(subCategoriesTable, ({one}) => ({
    category: one(categoriesTable, {
        fields: [subCategoriesTable.categoryId],
        references: [categoriesTable.id]
    }),
    user: one(user, {
        fields: [subCategoriesTable.userId],
        references: [user.id]
    })
}));