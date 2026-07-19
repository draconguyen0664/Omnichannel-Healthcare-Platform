import type { SQLiteDatabase } from "expo-sqlite";

export async function migrateDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS patient_profile (
      id INTEGER PRIMARY KEY NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    );
  `);
}
