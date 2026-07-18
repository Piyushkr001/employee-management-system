import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../config/env";
import * as schema from "./schema";

// Create the connection
export const client = postgres(env.DATABASE_URL);

// Create the Drizzle ORM instance
export const db = drizzle(client, { schema });

export default db;
