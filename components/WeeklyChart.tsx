import { DimensionValue, StyleSheet, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { lastSevenDateKeys } from "../utils/date";
import { Habit } from "../features/habits/habit.types";

type WeeklyChartProps = {
  habits: Habit[];
};

export function WeeklyChart({ habits }: WeeklyChartProps) {
  const { theme } = useTheme();
  const dates = lastSevenDateKeys();
  const max = Math.max(habits.length, 1);

  return (
    <View style={[styles.chart, { borderColor: theme.border }]}>
      {dates.map((dateKey) => {
        const total = habits.filter((habit) => habit.completions.includes(dateKey)).length;
        const height = `${Math.max(8, (total / max) * 100)}%` as DimensionValue;

        return (
          <View key={dateKey} style={styles.barTrack}>
            <View style={[styles.bar, { height, backgroundColor: theme.accent }]} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    height: 160,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10
  },
  barTrack: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end"
  },
  bar: {
    borderRadius: 6,
    minHeight: 8
  }
});
