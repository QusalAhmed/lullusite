import { pgTable, text, uuid, varchar, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Local
import { user } from "@/db/index.schema";

// Helper
import timestamps from "./columns.helpers";

export const courierTable = pgTable("courier", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => user.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
    }).notNull(),

    // e.g. "steadfast", "redx", "pathao"
    courierCode: varchar("courier_code", { length: 50 }).notNull(),

    // Optional human-friendly label override (e.g. "Steadfast Courier")
    courierName: varchar("courier_name", { length: 255 }),

    // Credentials / config
    apiKey: varchar("api_key", { length: 512 }),
    username: varchar("username", { length: 255 }),
    apiSecret: varchar("api_secret", { length: 512 }),
    accountId: varchar("account_id", { length: 255 }),

    // Enable / disable per courier
    isEnabled: boolean("is_enabled").notNull().default(false),

    ...timestamps,
}, (table) => ({
    userCourierUnique: uniqueIndex("user_courier_unique").on(table.userId, table.courierCode),
}));

export const courierRelations = relations(courierTable, ({ one }) => ({
    user: one(user, {
        fields: [courierTable.userId],
        references: [user.id],
    }),
}));

