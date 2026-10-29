process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import "dotenv/config";
import { Pool } from "pg";

async function main() {
  const rawConnectionString = process.env.DATABASE_URL;
  if (!rawConnectionString) {
    console.error("No DATABASE_URL set.");
    process.exit(1);
  }

  let cleanConnectionString = rawConnectionString;
  try {
    const url = new URL(cleanConnectionString);
    url.searchParams.delete("sslmode");
    url.searchParams.delete("sslaccept");
    cleanConnectionString = url.toString();
  } catch {}

  const pool = new Pool({
    connectionString: cleanConnectionString,
    ssl: { rejectUnauthorized: false },
    max: 1,
    connectionTimeoutMillis: 5000,
  });

  try {
    console.log("🔍 Checking active connections on PostgreSQL...");
    const currentConns = await pool.query(`
      SELECT pid, usename, client_addr, state, state_change, query
      FROM pg_stat_activity
      WHERE datname = current_database();
    `);

    console.log(`📊 Total connections currently open: ${currentConns.rows.length}`);
    currentConns.rows.forEach((r, idx) => {
      console.log(` [${idx + 1}] PID ${r.pid} | state: ${r.state} | query: ${r.query?.slice(0, 50)}`);
    });

    console.log("\n🧹 Terminating lingering idle connections from previous dev sessions...");
    const terminated = await pool.query(`
      SELECT pg_terminate_backend(pid) as terminated, pid
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND pid <> pg_backend_pid()
        AND state = 'idle';
    `);

    const terminatedCount = terminated.rows.filter((r) => r.terminated).length;
    console.log(`✅ Successfully closed ${terminatedCount} idle connections!`);

    const afterConns = await pool.query(`
      SELECT count(*) FROM pg_stat_activity WHERE datname = current_database();
    `);
    console.log(`🎉 Active connections now: ${afterConns.rows[0].count}`);
  } catch (err) {
    console.error("❌ Error cleaning connections:", err);
  } finally {
    await pool.end();
  }
}

main();

