// db
import db from "@/lib/drizzle-agent"
import { eq, and } from "drizzle-orm";

// Schemas
import { customerTable } from "@/db/index.schema";

export default async function createCustomer(
    {phoneNumber, name, merchantId, address, division}: {
        phoneNumber: string;
        name: string;
        merchantId: string;
        address?: string;
        division?: string;
    }
) {
    let isOldCustomer: boolean;
    let customerId: string;
    const [customer] = await db
        .select()
        .from(customerTable)
        .where(and(
            eq(customerTable.phone, phoneNumber),
            eq(customerTable.userId, merchantId),
        ))
        .limit(1);

    if (customer) {
        customerId = customer.id;
        isOldCustomer = true;
    } else {
        isOldCustomer = false;
        customerId = await db
            .insert(customerTable)
            .values({
                userId: merchantId,
                name: name,
                phone: phoneNumber,
                address: address,
                division: division,
            })
            .returning({id: customerTable.id})
            .then(res => res[0].id);
    }

    return {customerId, isOldCustomer};
}