import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "./habit.types";
import { normalizeHabit } from "./habit.logic";

const HABITS_KEY = "visual-habit-lab:habits";
const ONBOARDING_KEY = "visual-habit-lab:onboarding-complete";

export async function getHabits(): Promise<Habit[]> {
  try {
    const raw = await AsyncStorage.getItem(HABITS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.map(normalizeHabit).filter((habit): habit is Habit => Boolean(habit));
  } catch {
    return [];
  }
}

export async function saveHabits(habits: Habit[]): Promise<void> {
  const normalized = habits.map(normalizeHabit).filter((habit): habit is Habit => Boolean(habit));
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(normalized));
}

export async function saveHabit(habit: Habit): Promise<void> {
  const habits = await getHabits();
  await saveHabits([...habits.filter((item) => item.id !== habit.id), habit]);
}

export async function updateHabit(habit: Habit): Promise<void> {
  await saveHabit(habit);
}

export async function deleteHabit(id: string): Promise<void> {
  const habits = await getHabits();
  await saveHabits(habits.filter((habit) => habit.id !== id));
}

export async function getOnboardingComplete(): Promise<boolean> {
  return (await AsyncStorage.getItem(ONBOARDING_KEY)) === "true";
}

export async function setOnboardingComplete(value: boolean): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, value ? "true" : "false");
}

export async function clearHabitData(): Promise<void> {
  await AsyncStorage.multiRemove([HABITS_KEY, ONBOARDING_KEY]);
}
