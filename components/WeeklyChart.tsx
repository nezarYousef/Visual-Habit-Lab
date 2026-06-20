import { DimensionValue, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { formatShortDay, lastSevenDateKeys } from "../utils/date";
import { Habit } from "../features/habits/habit.types";
import { FONTS } from "../constants/typography";

type WeeklyChartProps = {
  habits: Habit[];
};

export function WeeklyChart({ habits }: WeeklyChartProps) {
  const { theme } = useTheme();
  const dates = lastSevenDateKeys();
  const max = Math.max(habits.length, 1);

  return (
    <View style={[styles.chart, { borderColor: theme.border, backgroundColor: theme.surface }]}>
      {dates.map((dateKey) => {
        const total = habits.filter((habit) => habit.completions.includes(dateKey)).length;
        const height = `${Math.max(7, (total / max) * 100)}%` as DimensionValue;

        return (
          <View key={dateKey} style={styles.barTrack}>
            <Text style={[styles.value, { color: theme.textMuted }]}>{total}</Text>
            <View style={styles.barArea}>
              <View style={[styles.bar, { height, backgroundColor: total > 0 ? theme.accent : theme.border }]} />
            </View>
            <Text style={[styles.label, { color: theme.textMuted }]}>{formatShortDay(dateKey).slice(0, 2)}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    height: 190,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10
  },
  barTrack: {
    flex: 1,
    alignItems: "center",
    gap: 6
  },
  barArea: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end"
  },
  bar: {
    width: "100%",
    borderRadius: 6,
    minHeight: 8
  },
  value: {
    ...FONTS.small
  },
  label: {
    ...FONTS.small
  }
});
