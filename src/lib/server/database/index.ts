import { env } from "$env/dynamic/private";
import { neon } from "@neondatabase/serverless";

export const sql = neon(env.DATABASE_URL);