import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Local
import { user, imageTable } from "@/db/index.schema";

// Helper
import timestamps from "./columns.helpers";

export const businessInformationTable = pgTable("business_information", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() =>
            user.id,
        {
            onDelete: "cascade",
            onUpdate: "cascade"
        }
    ).notNull().unique(),
    businessName: varchar("business_name", { length: 255 }).notNull(),
    address: varchar("address", { length: 512 }),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    description: varchar("description", { length: 1024 }),
    logoImageId: uuid('logo_image_id').references(() =>
            imageTable.id,
        {
            onDelete: "set null",
            onUpdate: "cascade"
        }
    ),

    ...timestamps
});

export const businessInformationRelations = relations(businessInformationTable, ({ one }) => ({
    user: one(user, {
        fields: [businessInformationTable.userId],
        references: [user.id]
    }),
    logoImage: one(imageTable, {
        fields: [businessInformationTable.logoImageId],
        references: [imageTable.id]
    })
}));

