import { Habit } from "./habit.types";

export async function initDB(): Promise<void> {
  return undefined;
}

export async function updateCompletion(_habitId: string, _dateKey: string): Promise<void> {
  return undefined;
}

export async function queryCompletionDates(_habitId: string): Promise<string[]> {
  return [];
}

export async function syncHabitCompletions(_habit: Habit): Promise<void> {
  return undefined;
}
