import { Habit } from "../features/habits/habit.types";
import { HabitWorlds } from "./HabitWorlds";

type GardenProps = {
  habits: Habit[];
  onSelectHabit: (id: string) => void;
};

export function Garden({ habits, onSelectHabit }: GardenProps) {
  return <HabitWorlds habits={habits} onSelectHabit={onSelectHabit} />;
}
