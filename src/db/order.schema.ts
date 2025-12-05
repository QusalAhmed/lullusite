import { pgTable, pgEnum, uuid, varchar, integer, numeric, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Schemas
import { user, productVariationTable, customerTable } from "./index.schema";

// Helper
import timestamps from "./columns.helpers";

export const orderStatus = pgEnum("order_status", [
    "pending",
    "ready_to_ship",
    "shipped",
    "delivered",
    "partially_delivered",
    "cancelled",
    "returned",
    "refunded",
    "partially_refunded",
]);

export const paymentStatus = pgEnum("payment_status", [
    "unpaid",
    "paid",
    "partially_paid",
    "refunded",
    "partially_refunded",
    "failed",
]);

export const orderTable = pgTable("orders", {
    id: uuid("id").primaryKey().defaultRandom(),

    // Relations
    customerId: uuid("customer_id").references(() => customerTable.id, {
        onDelete: "set null",
        onUpdate: "cascade",
    }),
    merchantId: varchar("merchant_id", { length: 255 })
        .notNull()
        .references(() => user.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),

    // Order identifiers
    orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),

    // Statuses
    status: orderStatus().notNull().default("pending"),
    paymentStatus: paymentStatus("payment_status").notNull().default("unpaid"),
    fulfillmentStatus: varchar("fulfillment_status", { length: 50 }).notNull().default("unfulfilled"),

    // Monetary totals
    currency: varchar("currency", { length: 3 }).notNull().default("BDT"),
    subtotalAmount: numeric("subtotal_amount", { precision: 10, scale: 2, mode: "number" }).notNull().default(0),
    discountAmount: numeric("discount_amount", { precision: 10, scale: 2, mode: "number" }).notNull().default(0),
    shippingAmount: numeric("shipping_amount", { precision: 10, scale: 2, mode: "number" }).notNull().default(0),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2, mode: "number" }).notNull().default(0),

    // Customer contact snapshot
    customerEmail: varchar("customer_email", { length: 255 }),
    customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
    customerName: varchar("customer_name", { length: 255 }).notNull(),

    // Shipping address snapshot
    shippingFullName: varchar("shipping_full_name", { length: 255 }).notNull(),
    shippingPhone: varchar("shipping_phone", { length: 50 }),
    shippingAddressLine1: varchar("shipping_address_line1", { length: 255 }).notNull(),
    shippingAddressLine2: varchar("shipping_address_line2", { length: 255 }),
    shippingCity: varchar("shipping_city", { length: 100 }).notNull(),
    shippingState: varchar("shipping_state", { length: 100 }),
    shippingPostalCode: varchar("shipping_postal_code", { length: 20 }),
    shippingCountry: varchar("shipping_country", { length: 100 }).notNull().default("Bangladesh"),
    shippingNotes: varchar("shipping_notes", { length: 500 }),

    // Payment / channel metadata
    paymentMethod: varchar("payment_method", { length: 50 }),
    paymentProvider: varchar("payment_provider", { length: 50 }),
    paymentReference: varchar("payment_reference", { length: 255 }),
    externalOrderId: varchar("external_order_id", { length: 255 }),
    notes: varchar("notes", { length: 1000 }),

    metadata: jsonb("metadata"),

    ...timestamps,
});

export const orderItemTable = pgTable("order_item", {
    id: uuid("id").primaryKey().defaultRandom(),

    // Relations
    orderId: uuid("order_id").notNull().references(() => orderTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
    }),
    productVariationId: uuid("product_variation_id")
        .notNull()
        .references(() => productVariationTable.id),

    // Snapshot product data
    productName: varchar("product_name", { length: 255 }).notNull(),
    productNameLocal: varchar("product_name_local", { length: 255 }),
    sku: varchar("sku", { length: 100 }).notNull(),
    variationName: varchar("variation_name", { length: 100 }),

    // Pricing & quantity
    quantity: integer("quantity").notNull().default(1),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2, mode: "number" }).notNull(),
    lineSubtotal: numeric("line_subtotal", { precision: 10, scale: 2, mode: "number" }).notNull().default(0),
    lineDiscountAmount: numeric("line_discount_amount", { precision: 10, scale: 2, mode: "number" }).notNull().default(0),
    lineTotal: numeric("line_total", { precision: 10, scale: 2, mode: "number" }).notNull().default(0),

    // Misc
    weight: numeric("weight", { precision: 10, scale: 2, mode: "number" }),

    ...timestamps,
});

export const orderRelations = relations(orderTable, ({ one, many }) => ({
    customer: one(customerTable, {
        fields: [orderTable.customerId],
        references: [customerTable.id],
    }),
    merchant: one(user, {
        fields: [orderTable.merchantId],
        references: [user.id],
    }),
    items: many(orderItemTable),
}));

export const orderItemRelations = relations(orderItemTable, ({ one }) => ({
    order: one(orderTable, {
        fields: [orderItemTable.orderId],
        references: [orderTable.id],
    }),
    variation: one(productVariationTable, {
        fields: [orderItemTable.productVariationId],
        references: [productVariationTable.id],
    }),
}));
