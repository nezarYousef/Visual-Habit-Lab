import * as SQLite from "expo-sqlite";
import { Habit } from "./habit.types";

type SQLiteDatabase = Awaited<ReturnType<typeof SQLite.openDatabaseAsync>>;

let dbPromise: Promise<SQLiteDatabase> | undefined;

async function getDb(): Promise<SQLiteDatabase> {
  dbPromise ??= SQLite.openDatabaseAsync("visual-habit-lab.db");
  return dbPromise;
}

export async function initDB(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS habit_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id TEXT NOT NULL,
      completed_at TEXT NOT NULL,
      UNIQUE(habit_id, completed_at)
    );
  `);
}

export async function updateCompletion(habitId: string, dateKey: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    "INSERT OR IGNORE INTO habit_completions (habit_id, completed_at) VALUES (?, ?)",
    habitId,
    dateKey
  );
}

export async function queryCompletionDates(habitId: string): Promise<string[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ completed_at: string }>(
    "SELECT completed_at FROM habit_completions WHERE habit_id = ? ORDER BY completed_at ASC",
    habitId
  );

  return rows.map((row: { completed_at: string }) => row.completed_at);
}

export async function syncHabitCompletions(habit: Habit): Promise<void> {
  await initDB();
  await Promise.all(habit.completions.map((dateKey) => updateCompletion(habit.id, dateKey)));
}
