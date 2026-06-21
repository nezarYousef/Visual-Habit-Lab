import {
  calculateHabitStreak,
  getHabitLevel,
  getHabitStatus,
  getLastCompletion,
  isCompletedForPeriod
} from "./habit.logic";
import { Habit, HabitLevel, HabitStatus } from "./habit.types";

export type HabitWorldProgress = {
  streak: number;
  level: HabitLevel;
  status: HabitStatus;
  completed: boolean;
};

export function getHabitWorldProgress(habit: Habit): HabitWorldProgress {
  const streak = calculateHabitStreak(habit);

  return {
    streak,
    level: getHabitLevel(streak),
    status: getHabitStatus(getLastCompletion(habit), habit.frequency),
    completed: isCompletedForPeriod(habit)
  };
}
