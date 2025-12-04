import { pgTable, pgEnum, uuid, varchar, integer, numeric, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Schemas
import { user, productVariationTable } from "./index.schema";

// Helper
import timestamps from "./columns.helpers";

export const incompleteOrderStatus = pgEnum("incomplete_order_status", [
    "active",
    "converted",
    "expired",
]);

export const incompleteOrderTable = pgTable("incomplete_orders", {
    id: uuid("id").primaryKey().defaultRandom(),

    // Customer phone number (primary identifier)
    phoneNumber: varchar("phone_number", { length: 50 }).notNull(),

    // Relations
    merchantId: varchar("merchant_id", { length: 255 }).notNull().references(() => user.id),

    // Status tracking
    status: incompleteOrderStatus().notNull().default("active"),

    // Conversion tracking
    convertedToOrderId: uuid("converted_to_order_id"),


    // Customer details
    customerName: varchar("customer_name", { length: 100 }),
    customerEmail: varchar("customer_email", { length: 100 }),
    customerAddress: varchar("customer_address", { length: 255 }),

    // Additional metadata (customer info, source, etc.)
    metadata: jsonb("metadata"),

    ...timestamps,
});

export const incompleteOrderItemTable = pgTable("incomplete_order_items", {
    id: uuid("id").primaryKey().defaultRandom(),

    // Relations
    incompleteOrderId: uuid("incomplete_order_id").notNull().references(() => incompleteOrderTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
    }),
    productVariationId: uuid("product_variation_id").notNull().references(() => productVariationTable.id),

    // Snapshot product data (for display purposes)
    variationName: varchar("variation_name", { length: 100 }),

    // Quantity and pricing
    quantity: integer("quantity").notNull().default(1),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2, mode: "number" }).notNull(),

    ...timestamps,
});

// Relations
export const incompleteOrderRelations = relations(incompleteOrderTable, ({ one, many }) => ({
    merchant: one(user, {
        fields: [incompleteOrderTable.merchantId],
        references: [user.id],
    }),
    items: many(incompleteOrderItemTable),
}));

export const incompleteOrderItemRelations = relations(incompleteOrderItemTable, ({ one }) => ({
    incompleteOrder: one(incompleteOrderTable, {
        fields: [incompleteOrderItemTable.incompleteOrderId],
        references: [incompleteOrderTable.id],
    }),
    productVariation: one(productVariationTable, {
        fields: [incompleteOrderItemTable.productVariationId],
        references: [productVariationTable.id],
    }),
}));

