import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { HABIT_LEVELS, VISUAL_TYPES } from "../constants/visuals";
import { FONTS } from "../constants/typography";
import { useTheme } from "../context/ThemeContext";
import {
  calculateHabitStreak,
  getHabitLevel,
  getHabitStatus,
  getLastCompletion,
  getWeeklyCompletion,
  isCompletedForPeriod
} from "../features/habits/habit.logic";
import { Habit } from "../features/habits/habit.types";
import { AppButton } from "./AppButton";
import { ProgressRing } from "./ProgressRing";
import { WeeklyTimeline } from "./WeeklyTimeline";
import { parseDateKey } from "../utils/date";

type HabitDetailsProps = {
  habit: Habit;
  onComplete: () => void;
  onDelete: () => void;
};

export function HabitDetails({ habit, onComplete, onDelete }: HabitDetailsProps) {
  const { theme } = useTheme();
  const visual = VISUAL_TYPES[habit.visualType];
  const streak = calculateHabitStreak(habit);
  const level = getHabitLevel(streak);
  const weekly = getWeeklyCompletion(habit.completions, habit.frequency);
  const lastCompletion = getLastCompletion(habit);
  const status = getHabitStatus(lastCompletion, habit.frequency);
  const completedForPeriod = isCompletedForPeriod(habit);
  const periodLabel = habit.frequency === "weekly" ? "week" : "today";
  const statusColor = status === "healthy" ? theme.primary : status === "at_risk" ? theme.warm : theme.danger;
  const statusMessage =
    status === "healthy"
      ? "This habit is on track."
      : status === "at_risk"
        ? "A completion soon will protect the streak."
        : "This habit needs attention.";
  const lastCompletionLabel = lastCompletion
    ? parseDateKey(lastCompletion).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "Not yet";

  return (
    <View style={styles.container}>
      <View style={[styles.hero, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.visual, { backgroundColor: visual.colors[0] }]}>
          <MaterialCommunityIcons name={visual.icon} size={44} color={visual.colors[1]} />
        </View>
        <View style={styles.heroText}>
          <Text style={[styles.title, { color: theme.text }]}>{habit.name}</Text>
          <Text style={[styles.meta, { color: theme.textMuted }]}>
            {habit.category} - {habit.frequency}
          </Text>
        </View>
      </View>

      <View style={[styles.statusPanel, { backgroundColor: theme.surface, borderColor: statusColor }]}>
        <MaterialCommunityIcons name={completedForPeriod ? "check-circle" : "alert-circle-outline"} size={20} color={statusColor} />
        <Text style={[styles.statusText, { color: theme.text }]}>{statusMessage}</Text>
      </View>

      <View style={styles.overview}>
        <ProgressRing value={weekly} />
        <View style={styles.metrics}>
          <Metric label="Streak" value={`${streak} ${habit.frequency === "weekly" ? "weeks" : "days"}`} />
          <Metric label="Level" value={HABIT_LEVELS[level].name} />
          <Metric label="Status" value={status.replace("_", " ")} />
          <Metric label="Last done" value={lastCompletionLabel} />
        </View>
      </View>

      <View style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.panelTitle, { color: theme.text }]}>Last seven days</Text>
        <WeeklyTimeline completions={habit.completions} frequency={habit.frequency} />
      </View>

      <AppButton
        label={completedForPeriod ? `Done this ${periodLabel}` : habit.frequency === "weekly" ? "Mark done this week" : "Mark done today"}
        icon={completedForPeriod ? "check-circle" : "check-circle-outline"}
        disabled={completedForPeriod}
        onPress={onComplete}
      />
      <AppButton label="Delete habit" icon="trash-can-outline" variant="danger" onPress={onDelete} />
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.metric, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18
  },
  hero: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    gap: 14,
    alignItems: "center"
  },
  visual: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center"
  },
  heroText: {
    flex: 1
  },
  title: {
    ...FONTS.h1
  },
  meta: {
    ...FONTS.body,
    textTransform: "capitalize"
  },
  overview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  metrics: {
    flex: 1,
    gap: 8
  },
  statusPanel: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  statusText: {
    ...FONTS.small,
    flex: 1
  },
  metric: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12
  },
  metricValue: {
    ...FONTS.h3,
    textTransform: "capitalize"
  },
  metricLabel: {
    ...FONTS.small
  },
  panel: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    gap: 14
  },
  panelTitle: {
    ...FONTS.h3
  }
});
