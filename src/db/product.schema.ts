import { pgTable, text, varchar, uuid, integer, numeric, boolean, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Schema
import { user, subCategoriesTable, imageTable, categoriesTable } from "./index.schema"

// Helper
import timestamps from "./columns.helpers";

export const productTable = pgTable("product", {
    id: uuid("id").primaryKey().defaultRandom(),
    merchantId: text("merchant_id").notNull().references(() => user.id),
    name: varchar("name", {length: 255}).notNull(),
    name_local: varchar("name_local", {length: 255}).notNull(),
    description: text("description").notNull(),
    youtubeVideoLink: varchar("youtube_video_link", {length: 255}),
    slug: varchar("slug", {length: 255}).unique(),
    category: uuid("category").references(() => categoriesTable.id),
    subcategory: uuid("subcategory").references(() => subCategoriesTable.id),
    tags: text("tags").array().default([]),
    seoDescription: text("seo_description").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    isSuspended: boolean("is_suspended").notNull().default(false),

    ...timestamps,
});

export const productRelations = relations(productTable, ({many}) => ({
    images: many(productImageTable),
    variations: many(productVariationTable),
}));

export const productImageTable = pgTable("product_image", {
        productId: uuid("product_id")
            .notNull()
            .references(() => productTable.id, {
                onDelete: "cascade",
                onUpdate: "cascade",
            }),
        image: uuid("image")
            .notNull()
            .references(() => imageTable.id, {
                onDelete: "cascade",
                onUpdate: "cascade",
            }),

        ...timestamps,
    },
    (table) => [
        primaryKey({columns: [table.productId, table.image]})
    ],
);

export const productImageRelations = relations(productImageTable, ({one}) => ({
    product: one(productTable, {
        fields: [productImageTable.productId],
        references: [productTable.id],
    }),
}));

export const productVariationTable = pgTable("product_variation", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull().references(() => productTable.id),
    name: varchar("name", {length: 100}).notNull(),
    sku: varchar("sku", {length: 100}).unique(),
    price: numeric("price", {precision: 10, scale: 2, mode: "number"}).notNull(),
    stock: integer("stock").notNull().default(0),
    weight: numeric("weight", {precision: 10, scale: 2, mode: "number"}).notNull().default(0),

    ...timestamps,
});

export const productVariationRelations = relations(productVariationTable, ({one}) => ({
    product: one(productTable, {
        fields: [productVariationTable.productId],
        references: [productTable.id],
    }),
}));

export const productVariationImageTable = pgTable("product_variation_image", {
    id: uuid("id").primaryKey().defaultRandom(),
    productVariationId: uuid("product_variation_id")
        .notNull()
        .references(() => productVariationTable.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    image: uuid("image")
        .notNull()
        .references(() => imageTable.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),

    ...timestamps,
});