import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { env } from "$env/dynamic/private";

export const db = drizzle(env.DATABASE_URL!, { schema });
export * from "./schema";
export { eq, and, count, not, or, sql, desc } from "drizzle-orm";