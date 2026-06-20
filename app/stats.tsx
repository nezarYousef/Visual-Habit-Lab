import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { BreakdownRow } from "../components/BreakdownRow";
import { Screen } from "../components/Screen";
import { StatCard } from "../components/StatCard";
import { WeeklyChart } from "../components/WeeklyChart";
import { FONTS } from "../constants/typography";
import { useHabits } from "../context/HabitContext";
import { useTheme } from "../context/ThemeContext";
import { getHabitStats } from "../features/habits/habit.logic";
import { router } from "expo-router";

export default function StatsScreen() {
  const { habits } = useHabits();
  const { theme } = useTheme();
  const stats = getHabitStats(habits);

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.text }]}>Statistics</Text>
      <View style={styles.grid}>
        <StatCard label="Active habits" value={`${stats.activeHabits}`} icon="sprout" />
        <StatCard label="Done now" value={`${stats.completedThisPeriod}`} icon="check-circle-outline" />
        <StatCard label="Longest streak" value={`${stats.longestStreak}`} icon="fire" />
        <StatCard label="Weekly average" value={`${stats.averageWeeklyCompletion}%`} icon="calendar-check" />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Completions by day</Text>
      <WeeklyChart habits={habits} />

      <View style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.panelTitle, { color: theme.text }]}>Garden health</Text>
        <BreakdownRow label="Healthy" value={stats.healthyHabits} total={stats.activeHabits} color={theme.primary} />
        <BreakdownRow label="At risk" value={stats.atRiskHabits} total={stats.activeHabits} color={theme.warm} />
        <BreakdownRow label="Fading" value={stats.fadingHabits} total={stats.activeHabits} color={theme.danger} />
      </View>

      <View style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.panelTitle, { color: theme.text }]}>Habit mix</Text>
        <BreakdownRow label="Daily" value={stats.dailyHabits} total={stats.activeHabits} color={theme.accent} />
        <BreakdownRow label="Weekly" value={stats.weeklyHabits} total={stats.activeHabits} color={theme.primary} />
        {stats.categoryBreakdown.slice(0, 4).map((item) => (
          <BreakdownRow key={item.category} label={item.category} value={item.count} total={stats.activeHabits} />
        ))}
      </View>

      <View style={styles.grid}>
        <StatCard label="Best habit" value={stats.bestHabit?.name ?? "-"} icon="star-outline" />
        <StatCard label="Needs attention" value={stats.weakestHabit?.name ?? "-"} icon="alert-circle-outline" />
      </View>

      <AppButton label="Back to garden" icon="arrow-left" variant="secondary" onPress={() => router.replace("/home")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...FONTS.h1,
    marginBottom: 18
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 22
  },
  sectionTitle: {
    ...FONTS.h3,
    marginBottom: 10
  },
  panel: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    gap: 12,
    marginTop: 18
  },
  panelTitle: {
    ...FONTS.h3
  }
});
