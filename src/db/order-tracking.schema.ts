import {pgTable, uuid, text} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

// Schemas
import {orderTable} from "./index.schema";

// Helper
import timestamps from "./columns.helpers";

export const orderTrackingTable = pgTable("order_tracking", {
    id: uuid("id").primaryKey().defaultRandom(),

    // Relations
    orderId: uuid("order_id")
        .notNull()
        .references(() => orderTable.id),

    // Tracking Info
    trackingMessage: text("tracking_message").notNull(),

    // Timestamps
    ...timestamps,
});

export const orderTrackingRelations = relations(orderTrackingTable, ({one}) => ({
    order: one(orderTable, {
        fields: [orderTrackingTable.orderId],
        references: [orderTable.id],
    })
}));