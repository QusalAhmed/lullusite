import {
    pgTable,
    pgSequence,
    pgEnum,
    uuid,
    varchar,
    integer,
    numeric,
    jsonb,
    bigint,
    boolean,
    text
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// Schemas
import { user, productVariationTable, customerTable } from "./index.schema";

// Helper
import timestamps from "./columns.helpers";

// Constants / Enums
import ORDER_STATUS from "@/constant/order-status";
import PAYMENT_STATUS from "@/constant/payment-status";
import ACTION_SOURCES from "@/constant/action-source";

export const orderStatus = pgEnum(
    "order_status",
    ORDER_STATUS.map(s => s.value) as [string, ...string[]]
);

export type OrderStatusType = (typeof orderStatus.enumValues)[number];

export const paymentStatus = pgEnum(
    "payment_status",
    PAYMENT_STATUS.map(s => s.value) as [string, ...string[]]
);

export type PaymentStatusType = (typeof paymentStatus.enumValues)[number];

export const actionSourceEnum = pgEnum(
    "action_source_enum",
    ACTION_SOURCES.map(s => s.value) as [string, ...string[]]
);

export type ActionSourceType = (typeof actionSourceEnum.enumValues)[number];

export const orderNumberSeq = pgSequence("order_number_seq", {
    startWith: 1000,
    cycle: false,
    cache: 10,
    increment: 1,
});

export const orderTable = pgTable("orders", {
    id: uuid("id").primaryKey().defaultRandom(),

    // Relations
    customerId: uuid("customer_id")
        .notNull()
        .references(() => customerTable.id, {
            onDelete: "set null",
            onUpdate: "cascade",
        }),
    merchantId: varchar("merchant_id", {length: 255})
        .notNull()
        .references(() => user.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),

    // Order identifiers
    orderNumber: bigint("order_number", {mode: "number"})
        .notNull()
        .default(sql`nextval
        ('order_number_seq')`),

    // Statuses
    status: orderStatus().notNull().default("pending"),
    paymentStatus: paymentStatus("payment_status").notNull().default("unpaid"),

    // Monetary totals
    currency: varchar("currency", {length: 3}).notNull().default("BDT"),
    subtotalAmount: numeric("subtotal_amount", {precision: 10, scale: 2, mode: "number"}).notNull().default(0),
    discountAmount: numeric("discount_amount", {precision: 10, scale: 2, mode: "number"}).notNull().default(0),
    shippingAmount: numeric("shipping_amount", {precision: 10, scale: 2, mode: "number"}).notNull().default(0),
    partialAmount: numeric("partial_amount", {precision: 10, scale: 2, mode: "number"}).notNull().default(0),
    taxAmount: numeric("tax_amount", {precision: 10, scale: 2, mode: "number"}).notNull().default(0),
    totalAmount: numeric("total_amount", {precision: 10, scale: 2, mode: "number"}).notNull().default(0),
    amountPaid: numeric("amount_paid", {precision: 10, scale: 2, mode: "number"}).notNull().default(0),
    amountDue: numeric("amount_due", {precision: 10, scale: 2, mode: "number"}).notNull().default(0),

    // Customer contact snapshot
    customerName: varchar("customer_name", {length: 255}),
    customerEmail: varchar("customer_email", {length: 255}),
    customerPhone: varchar("customer_phone", {length: 50}),
    customerAdditionalPhone: varchar("customer_additional_phone", {length: 50}),

    // Shipping address snapshot
    shippingFullName: varchar("shipping_full_name", {length: 255}).notNull(),
    shippingPhone: varchar("shipping_phone", {length: 50}).notNull(),
    shippingEmail: varchar("shipping_email", {length: 255}),
    shippingAddress: text("shipping_address").notNull(),
    shippingCity: varchar("shipping_city", {length: 100}).notNull(),
    shippingDivision: varchar("shipping_division", {length: 50}),
    shippingState: varchar("shipping_state", {length: 100}),
    shippingPostalCode: varchar("shipping_postal_code", {length: 20}),
    shippingCountry: varchar("shipping_country", {length: 100}).notNull().default("Bangladesh"),
    shippingNotes: varchar("shipping_notes", {length: 500}),

    // Payment / channel metadata
    paymentMethod: varchar("payment_method", {length: 50}),
    paymentProvider: varchar("payment_provider", {length: 50}),
    paymentReference: varchar("payment_reference", {length: 255}),
    externalOrderId: varchar("external_order_id", {length: 255}),
    paymentNote: varchar("notes", {length: 1000}),

    // Analytics
    ipAddress: varchar("ip_address", {length: 45}).notNull(),
    userAgent: varchar("user_agent", {length: 1000}).notNull(),
    actionSource: actionSourceEnum("action_source").notNull(),
    eventSourceUrl: varchar("event_source_url", {length: 1000}).notNull(),
    reportToPixel: boolean("report_to_pixel").notNull().default(false),
    fbc: text("fbc"),
    fbp: text("fbp").notNull(),
    sourceChannel:
        jsonb("source_channel")
            .$type<{ channel: string; source: string }>()
            .notNull(),

    // Notes
    customerNote:
        varchar("customer_note", {length: 1000}),
    merchantNote:
        varchar("merchant_note", {length: 1000}),


    ...timestamps,
})

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
    sku: varchar("sku", {length: 100}).notNull(),
    variationName: varchar("variation_name", {length: 100}).notNull(),
    thumbnailUrl: varchar("thumbnail_url", {length: 1000}).notNull(),
    quantity: integer("quantity").notNull().default(1).notNull(),
    unitPrice: numeric("unit_price", {precision: 10, scale: 2, mode: "number"}).notNull(),
    lineSubtotal: numeric("line_subtotal", {precision: 10, scale: 2, mode: "number"}).notNull().default(0),
    lineDiscountAmount: numeric("line_discount_amount", {precision: 10, scale: 2, mode: "number"}).notNull().default(0),
    lineTotal: numeric("line_total", {precision: 10, scale: 2, mode: "number"}).notNull().default(0),
    weight: numeric("weight", {precision: 10, scale: 2, mode: "number"}),

    ...timestamps,
});

export const orderRelations = relations(orderTable, ({one, many}) => ({
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

export const orderItemRelations = relations(orderItemTable, ({one}) => ({
    order: one(orderTable, {
        fields: [orderItemTable.orderId],
        references: [orderTable.id],
    }),
    variation: one(productVariationTable, {
        fields: [orderItemTable.productVariationId],
        references: [productVariationTable.id],
    }),
}));
