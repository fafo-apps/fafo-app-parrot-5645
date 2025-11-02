// utils/pool.ts
import { Pool } from "pg";
import { parse } from "pg-connection-string";

declare global {
  var _pool: Pool | undefined;
}

if (!global._pool) {
  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) throw new Error("Missing SUPABASE_DB_URL");

  const config = parse(connectionString);
  config.ssl = { rejectUnauthorized: false };

  global._pool = new Pool(config);

  // 👇 Force schema explicitly after connection
  const schema = process.env.SUPABASE_SCHEMA || 'public';
  global._pool.on('connect', (client) => {
    client.query(`SET search_path TO ${schema}, public;`).catch(console.error);
  });
}

export const pool = global._pool;
