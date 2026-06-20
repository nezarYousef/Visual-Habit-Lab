import { VisualType } from "../../constants/visuals";

export type HabitFrequency = "daily" | "weekly";
export type HabitStatus = "healthy" | "at_risk" | "fading";
export type HabitLevel = 1 | 2 | 3 | 4;

export type Habit = {
  id: string;
  name: string;
  category: string;
  frequency: HabitFrequency;
  visualType: VisualType;
  createdAt: string;
  reminderTime?: string;
  completions: string[];
};

export type HabitDraft = {
  name: string;
  category: string;
  frequency: HabitFrequency;
  visualType: VisualType;
  reminderTime?: string;
};

export type HabitStats = {
  activeHabits: number;
  longestStreak: number;
  averageWeeklyCompletion: number;
  bestHabit?: Habit;
  weakestHabit?: Habit;
};
