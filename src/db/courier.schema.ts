import { pgTable, text, uuid, varchar, boolean, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Local
import { user } from "@/db/index.schema";
import { orderTable } from "./order.schema";

// Constant
import courierList from "@/constant/courier-list";

// Helper
import timestamps from "./columns.helpers";

export const courierCodeEnum = pgEnum("courier_code_enum",
    courierList.map(courier => courier.id) as [string, ...string[]]
);

export const courierTable = pgTable("courier", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => user.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
    }).notNull(),

    // e.g. "steadfast", "redx", "pathao"
    courierCode: varchar("courier_code", {length: 50}).notNull(),

    // Optional human-friendly label override (e.g. "Steadfast Courier")
    courierName: varchar("courier_name", {length: 255}),

    // Credentials / config
    apiKey: varchar("api_key", {length: 512}),
    username: varchar("username", {length: 255}),
    apiSecret: varchar("api_secret", {length: 512}),
    accountId: varchar("account_id", {length: 255}),

    // Enable / disable per courier
    isEnabled: boolean("is_enabled").notNull().default(false),

    ...timestamps,
}, (table) => ({
    userCourierUnique: uniqueIndex("user_courier_unique").on(table.userId, table.courierCode),
}));

export const courierRelations = relations(courierTable, ({one}) => ({
    user: one(user, {
        fields: [courierTable.userId],
        references: [user.id],
    }),
}));

// Booking
export const steadfastParcelTable = pgTable("steadfast_parcel", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").references(() => orderTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
    }).notNull(),
    consignmentId: varchar("consignment_id", {length: 100}).notNull(),
    trackingCode: varchar("tracking_code", {length: 100}).notNull(),

    ...timestamps,
});

export const steadfastParcelRelations = relations(steadfastParcelTable, ({one}) => ({
    order: one(orderTable, {
        fields: [steadfastParcelTable.orderId],
        references: [orderTable.id],
    }),
}));