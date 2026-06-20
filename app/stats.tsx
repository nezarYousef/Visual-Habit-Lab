import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
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
        <StatCard label="Longest streak" value={`${stats.longestStreak}`} icon="fire" />
        <StatCard label="Weekly average" value={`${stats.averageWeeklyCompletion}%`} icon="calendar-check" />
        <StatCard label="Best habit" value={stats.bestHabit?.name ?? "-"} icon="star-outline" />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Completions by day</Text>
      <WeeklyChart habits={habits} />
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
  }
});
