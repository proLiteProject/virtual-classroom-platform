import fs from "fs";
import path from "path";
import pool from "../config/db.js";

const migrationsDir = path.join(process.cwd(), "src/migrations/sql");

async function runMigrations() {
  const [applied] = await pool.query("SELECT name FROM migrations");
  const appliedNames = applied.map(m => m.name);

  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (!appliedNames.includes(file)) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      console.log(`▶ Running migration: ${file}`);
      await pool.query(sql);
      await pool.query("INSERT INTO migrations (name) VALUES (?)", [file]);
      console.log(`✔ Migration applied: ${file}`);
    }
  }

  console.log("✅ All migrations completed");
  process.exit(0);
}

runMigrations().catch(err => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
