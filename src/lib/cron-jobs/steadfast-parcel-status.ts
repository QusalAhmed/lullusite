'use server'

import axios from "axios"
import pLimit from 'p-limit';
import { OrderStatusType } from '@/constant/order-status'

// db
import db from "@/lib/drizzle-agent"
import { eq, sql, ne, and } from "drizzle-orm"
import { orderTable, courierTable } from "@/db/index.schema"

const updateSteadfastParcelStatus = async () => {
    const limit = pLimit(1)

    const orders = await db
        .select({
            merchantId: orderTable.merchantId,
            consignments: sql<
                { consignmentsId: string; apiKey: string, secretKey: string }[]
            >`
                jsonb_agg
                (
                jsonb_build_object(
                    'consignmentsId',
                ${orderTable.consignmentsId},
                'apiKey',
                ${courierTable.apiKey},
                'secretKey',
                ${courierTable.apiSecret}
                )
                )
            `,
        })
        .from(orderTable)
        .innerJoin(
            courierTable,
            eq(orderTable.merchantId, courierTable.userId)
        )
        .where(
            and(
                eq(orderTable.status, "shipped"),
                // eq(orderTable.courierCode, "steadfast"),
                ne(orderTable.consignmentsId, ""),
                ne(courierTable.apiKey, ""),
                ne(courierTable.apiSecret, "")
            )
        )
        .groupBy(orderTable.merchantId);

    // API call to steadfast server
    axios.defaults.baseURL = "https://portal.packzy.com/api/v1"
    orders.map(async order => {
        const consignments = order.consignments
        await Promise.all(consignments.map((consignment) => {
            limit(() => axios.get(`/status_by_cid/${consignment.consignmentsId}`, {
                headers: {
                    'Api-Key': consignment.apiKey,
                    'Secret-Key': consignment.secretKey,
                    'Content-Type': 'application/json',
                },
            }).then(async function (response) {
                console.log(`Order ${consignment.consignmentsId} status:`, response.data)

                // Set Status
                let status: OrderStatusType | null = null
                switch (response.data.delivery_status) {
                    case "delivered":
                        status = 'delivered'
                        break
                    case "partial_delivered":
                        status = 'partially_delivered'
                        break
                    case "cancelled":
                        status = 'returned'
                        break
                }
                if (status) {
                    // Update status to database
                    await db
                        .update(orderTable)
                        .set({
                            status
                        })
                        .where(eq(orderTable.consignmentsId, consignment.consignmentsId))
                }
            }).catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            }))
        }))
    })
}

export default updateSteadfastParcelStatus