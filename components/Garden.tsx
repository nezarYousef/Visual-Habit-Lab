import { StyleSheet, View } from "react-native";
import { Habit } from "../features/habits/habit.types";
import { AnimatedGardenItem } from "./AnimatedGardenItem";

type GardenProps = {
  habits: Habit[];
  onSelectHabit: (id: string) => void;
};

export function Garden({ habits, onSelectHabit }: GardenProps) {
  return (
    <View style={styles.grid}>
      {habits.map((habit, index) => (
        <AnimatedGardenItem key={habit.id} habit={habit} index={index} onPress={() => onSelectHabit(habit.id)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between"
  }
});
