import db from "@/lib/drizzle-agent";
import { eq } from "drizzle-orm";
import getSession from "@/lib/get-session";
import { user } from "@/db/index.schema"

export async function getUser() {
    const session = await getSession();

    return db
        .query
        .user
        .findFirst({
            where: eq(user.id, session.user.id)
        })
}

export default getUser;

// export getUser return type
export type GetUserType = Awaited<ReturnType<typeof getUser>>;