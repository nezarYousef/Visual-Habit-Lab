import { StyleSheet, Text, View } from "react-native";
import { FONTS } from "../constants/typography";
import { useTheme } from "../context/ThemeContext";
import { formatShortDay, lastSevenDateKeys } from "../utils/date";
import { HabitFrequency } from "../features/habits/habit.types";

type WeeklyTimelineProps = {
  completions: string[];
  frequency: HabitFrequency;
};

export function WeeklyTimeline({ completions, frequency }: WeeklyTimelineProps) {
  const { theme } = useTheme();
  const completed = new Set(completions);
  const weekComplete = lastSevenDateKeys().some((dateKey) => completed.has(dateKey));

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {lastSevenDateKeys().map((dateKey) => {
          const isComplete = completed.has(dateKey);
          const active = frequency === "weekly" ? weekComplete : isComplete;

          return (
            <View key={dateKey} style={styles.day}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: active ? theme.primary : theme.surface,
                    borderColor: isComplete ? theme.primary : theme.border,
                    opacity: frequency === "weekly" && active && !isComplete ? 0.32 : 1
                  }
                ]}
              />
              <Text style={[styles.label, { color: theme.textMuted }]}>{formatShortDay(dateKey).slice(0, 2)}</Text>
            </View>
          );
        })}
      </View>
      <Text style={[styles.summary, { color: theme.textMuted }]}>
        {frequency === "weekly"
          ? weekComplete
            ? "Weekly target complete"
            : "Complete once this week"
          : `${completions.filter((dateKey) => lastSevenDateKeys().includes(dateKey)).length}/7 days complete`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8
  },
  day: {
    flex: 1,
    alignItems: "center",
    gap: 6
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1
  },
  label: {
    ...FONTS.small
  },
  summary: {
    ...FONTS.small,
    textAlign: "center"
  }
});
