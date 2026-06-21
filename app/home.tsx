import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { EmptyState } from "../components/EmptyState";
import { HomeWorld } from "../components/world/HomeWorld";
import { Screen } from "../components/Screen";
import { StatCard } from "../components/StatCard";
import { StatusBanner } from "../components/StatusBanner";
import { FONTS } from "../constants/typography";
import { useHabits } from "../context/HabitContext";
import { useTheme } from "../context/ThemeContext";
import { getHabitStats, sortHabitsForGarden } from "../features/habits/habit.logic";

export default function HomeScreen() {
  const { habits, markHabitDone, isSaving, error, clearError } = useHabits();
  const { theme, toggleTheme } = useTheme();
  const stats = getHabitStats(habits);
  const sortedHabits = sortHabitsForGarden(habits);

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={[styles.kicker, { color: theme.primary }]}>Today</Text>
          <Text style={[styles.title, { color: theme.text }]}>Your world</Text>
        </View>
        <MaterialCommunityIcons name="theme-light-dark" size={28} color={theme.text} onPress={toggleTheme} />
      </View>

      {error ? <StatusBanner message={error} tone="danger" onDismiss={clearError} /> : null}
      {isSaving ? <StatusBanner message="Saving garden changes" /> : null}

      <View style={styles.statsRow}>
        <StatCard label="Active habits" value={`${stats.activeHabits}`} icon="sprout" />
        <StatCard label="Longest streak" value={`${stats.longestStreak}`} icon="fire" />
      </View>

      <View style={styles.actions}>
        <AppButton label="New habit" icon="plus" onPress={() => router.push("/create-habit")} style={styles.actionButton} />
        <AppButton label="Stats" icon="chart-bar" variant="secondary" onPress={() => router.push("/stats")} style={styles.actionButton} />
        <AppButton label="Demo" icon="flask-outline" variant="secondary" onPress={() => router.push("/demo")} style={styles.actionButton} />
      </View>

      <HomeWorld
        habits={sortedHabits}
        onSelectHabit={(id) => router.push(`/habit/${id}`)}
        onCompleteHabit={markHabitDone}
      />

      {habits.length === 0 ? (
        <EmptyState
          title="No habits planted yet"
          message="Create your first habit and give it a visual form to grow."
          actionLabel="Create habit"
          onAction={() => router.push("/create-habit")}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18
  },
  kicker: {
    ...FONTS.small,
    textTransform: "uppercase"
  },
  title: {
    ...FONTS.h1
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 14
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18
  },
  actionButton: {
    flexGrow: 1,
    minWidth: 105
  }
});
