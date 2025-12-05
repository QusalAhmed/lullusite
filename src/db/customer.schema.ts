import {pgTable, pgEnum, uuid, varchar, text} from "drizzle-orm/pg-core";

// Helper
import timestamps from "./columns.helpers";

// Schema
import {user} from "./index.schema";

export const customerType = pgEnum("customer_type", [
    "individual",
    "business",
]);

export const customerTable = pgTable("customers", {
    id: uuid("id").primaryKey().defaultRandom(),

    // Relations
    userId: varchar("user_id", { length: 255 }).references(() => user.id),

    // Customer details
    name: varchar("name", {length: 255}),
    email: varchar("email", {length: 255}),
    phone: varchar("phone", {length: 50}).notNull(),
    division: varchar("division", {length: 100}),
    address: text('address'),

    // Customer type
    type: customerType().notNull().default("individual"),

    ...timestamps
});