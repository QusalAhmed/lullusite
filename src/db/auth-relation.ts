import {user, businessInformationTable} from './index.schema'
import { relations } from 'drizzle-orm'

export const authRelation = relations(user, ({ one }) => ({
    businessInformation: one(businessInformationTable, {
        fields: [user.id],
        references: [businessInformationTable.userId],
    }),
}))