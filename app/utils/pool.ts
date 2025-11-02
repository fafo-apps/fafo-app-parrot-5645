// utils/pool.ts
import { Pool, PoolConfig } from "pg";
import { parse } from "pg-connection-string";

declare global {
  var _pool: Pool | undefined;
}

if (!global._pool) {
  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) throw new Error("Missing SUPABASE_DB_URL");

  const parsed = parse(connectionString);
  const config: PoolConfig = {
    ssl: { rejectUnauthorized: false },
  };

  if (parsed.host) config.host = parsed.host;
  if (parsed.port) config.port = Number(parsed.port);
  if (parsed.database) config.database = parsed.database;
  if (parsed.user) config.user = parsed.user;
  if (parsed.password) config.password = parsed.password;

  global._pool = new Pool(config);

  // 👇 Force schema explicitly after connection
  const schema = process.env.SUPABASE_SCHEMA;
  global._pool.on('connect', (client) => {
    client.query(`SET search_path TO ${schema}, public;`).catch(console.error);
  });
}

export const pool = global._pool;
