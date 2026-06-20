import { VISUAL_TYPES } from "../../constants/visuals";
import { Habit, HabitDraft, HabitFrequency, HabitLevel, HabitStats, HabitStatus } from "./habit.types";
import { addDays, daysBetween, lastSevenDateKeys, parseDateKey, toDateKey } from "../../utils/date";

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const REMINDER_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export function normalizeHabitName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

export function validateHabitDraft(draft: HabitDraft, existingHabits: Habit[] = []): string | undefined {
  const name = draft.name.trim().replace(/\s+/g, " ");
  if (name.length < 2) return "Use at least 2 characters for the habit name.";
  if (name.length > 42) return "Keep the habit name under 42 characters.";

  const duplicate = existingHabits.some((habit) => normalizeHabitName(habit.name) === normalizeHabitName(name));
  if (duplicate) return "A habit with this name already exists.";

  const reminderTime = draft.reminderTime?.trim();
  if (reminderTime && !REMINDER_TIME_PATTERN.test(reminderTime)) {
    return "Use a 24-hour reminder time like 08:30.";
  }

  return undefined;
}

export function normalizeHabit(value: unknown): Habit | undefined {
  if (!value || typeof value !== "object") return undefined;

  const item = value as Partial<Habit>;
  const name = typeof item.name === "string" ? item.name.trim() : "";
  if (!name) return undefined;

  const frequency: HabitFrequency = item.frequency === "weekly" ? "weekly" : "daily";
  const visualType = item.visualType && item.visualType in VISUAL_TYPES ? item.visualType : "tree";
  const createdAt = typeof item.createdAt === "string" && DATE_KEY_PATTERN.test(item.createdAt) ? item.createdAt : toDateKey();
  const completions = Array.isArray(item.completions)
    ? item.completions.filter((dateKey): dateKey is string => typeof dateKey === "string" && DATE_KEY_PATTERN.test(dateKey))
    : [];

  return {
    id: typeof item.id === "string" && item.id.trim() ? item.id : `${Date.now()}-${Math.round(Math.random() * 100000)}`,
    name,
    category: typeof item.category === "string" && item.category.trim() ? item.category.trim() : "General",
    frequency,
    visualType,
    reminderTime: typeof item.reminderTime === "string" && item.reminderTime.trim() ? item.reminderTime.trim() : undefined,
    createdAt,
    completions: normalizeCompletions(completions)
  };
}

export function createHabitFromDraft(draft: HabitDraft): Habit {
  return {
    id: `${Date.now()}-${Math.round(Math.random() * 100000)}`,
    name: draft.name.trim().replace(/\s+/g, " "),
    category: draft.category.trim() || "General",
    frequency: draft.frequency,
    visualType: draft.visualType,
    reminderTime: draft.reminderTime?.trim() || undefined,
    createdAt: toDateKey(),
    completions: []
  };
}

export function normalizeCompletions(completions: string[]): string[] {
  return Array.from(new Set(completions)).sort();
}

export function calculateStreak(completions: string[], today = new Date()): number {
  const completed = new Set(normalizeCompletions(completions));
  let cursor = toDateKey(today);
  let streak = 0;

  while (completed.has(cursor)) {
    streak += 1;
    cursor = toDateKey(addDays(parseDateKey(cursor), -1));
  }

  return streak;
}

export function calculateWeeklyStreak(completions: string[], today = new Date()): number {
  const completed = new Set(normalizeCompletions(completions));
  let cursor = today;
  let streak = 0;

  while (true) {
    const weekDays = Array.from({ length: 7 }, (_, index) => toDateKey(addDays(cursor, -index)));
    if (!weekDays.some((dateKey) => completed.has(dateKey))) break;

    streak += 1;
    cursor = addDays(cursor, -7);
  }

  return streak;
}

export function calculateHabitStreak(habit: Habit, today = new Date()): number {
  return habit.frequency === "weekly" ? calculateWeeklyStreak(habit.completions, today) : calculateStreak(habit.completions, today);
}

export function getHabitLevel(streak: number): HabitLevel {
  if (streak >= 21) return 4;
  if (streak >= 7) return 3;
  if (streak >= 3) return 2;
  return 1;
}

export function getHabitStatus(lastCompletion?: string, frequency: HabitFrequency = "daily"): HabitStatus {
  if (!lastCompletion) return "fading";

  const age = daysBetween(lastCompletion);
  if (frequency === "weekly") {
    if (age <= 7) return "healthy";
    if (age <= 10) return "at_risk";
    return "fading";
  }

  if (age <= 1) return "healthy";
  if (age <= 3) return "at_risk";
  return "fading";
}

export function getWeeklyCompletion(completions: string[], frequency: HabitFrequency = "daily"): number {
  const completed = new Set(completions);
  const days = lastSevenDateKeys();
  if (frequency === "weekly") {
    return days.some((dateKey) => completed.has(dateKey)) ? 100 : 0;
  }

  const completedDays = days.filter((dateKey) => completed.has(dateKey)).length;

  return Math.round((completedDays / days.length) * 100);
}

export function isCompletedForPeriod(habit: Habit, dateKey = toDateKey()): boolean {
  if (habit.frequency === "daily") return habit.completions.includes(dateKey);

  const completed = new Set(habit.completions);
  const selected = parseDateKey(dateKey);
  return Array.from({ length: 7 }, (_, index) => toDateKey(addDays(selected, -index))).some((day) => completed.has(day));
}

export function markAsCompleted(habit: Habit, dateKey = toDateKey()): Habit {
  if (isCompletedForPeriod(habit, dateKey)) return habit;

  return {
    ...habit,
    completions: normalizeCompletions([...habit.completions, dateKey])
  };
}

export function getLastCompletion(habit: Habit): string | undefined {
  return normalizeCompletions(habit.completions).at(-1);
}

export function sortHabitsForGarden(habits: Habit[]): Habit[] {
  const statusScore: Record<HabitStatus, number> = {
    fading: 0,
    at_risk: 1,
    healthy: 2
  };

  return [...habits].sort((a, b) => {
    const aStatus = getHabitStatus(getLastCompletion(a), a.frequency);
    const bStatus = getHabitStatus(getLastCompletion(b), b.frequency);
    const statusDifference = statusScore[aStatus] - statusScore[bStatus];
    if (statusDifference !== 0) return statusDifference;

    return a.name.localeCompare(b.name);
  });
}

export function getHabitStats(habits: Habit[]): HabitStats {
  const scored = habits.map((habit) => ({
    habit,
    streak: calculateHabitStreak(habit),
    weekly: getWeeklyCompletion(habit.completions, habit.frequency)
  }));

  const longest = scored.reduce((max, item) => Math.max(max, item.streak), 0);
  const averageWeeklyCompletion = scored.length
    ? Math.round(scored.reduce((sum, item) => sum + item.weekly, 0) / scored.length)
    : 0;

  return {
    activeHabits: habits.length,
    longestStreak: longest,
    averageWeeklyCompletion,
    bestHabit: [...scored].sort((a, b) => b.weekly - a.weekly)[0]?.habit,
    weakestHabit: [...scored].sort((a, b) => a.weekly - b.weekly)[0]?.habit
  };
}
