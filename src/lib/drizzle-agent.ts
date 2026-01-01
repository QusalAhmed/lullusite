import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/db/index.schema'

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error(
        'DATABASE_URL is not set. Add it to .env/.env.local or configure it in your deployment environment.'
    );
}
const db = drizzle({
    connection: {
        connectionString,
        ssl: true,
    },
    schema,
});

export default db;