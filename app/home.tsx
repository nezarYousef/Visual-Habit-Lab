import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { EmptyState } from "../components/EmptyState";
import { Garden } from "../components/Garden";
import { Screen } from "../components/Screen";
import { StatCard } from "../components/StatCard";
import { StatusBanner } from "../components/StatusBanner";
import { FONTS } from "../constants/typography";
import { useHabits } from "../context/HabitContext";
import { useTheme } from "../context/ThemeContext";
import { getHabitStats, isCompletedForPeriod, sortHabitsForGarden } from "../features/habits/habit.logic";

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
          <Text style={[styles.title, { color: theme.text }]}>Your garden</Text>
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

      {habits.length === 0 ? (
        <EmptyState
          title="No habits planted yet"
          message="Create your first habit and give it a visual form to grow."
          actionLabel="Create habit"
          onAction={() => router.push("/create-habit")}
        />
      ) : (
        <Garden habits={sortedHabits} onSelectHabit={(id) => router.push(`/habit/${id}`)} />
      )}

      {habits.length > 0 ? (
        <View style={[styles.quickPanel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.panelTitle, { color: theme.text }]}>Quick complete</Text>
          {sortedHabits.slice(0, 3).map((habit) => {
            const completed = isCompletedForPeriod(habit);

            return (
            <AppButton
              key={habit.id}
              label={completed ? `${habit.name} done` : habit.name}
              icon={completed ? "check-circle" : "check-circle-outline"}
              variant="ghost"
              disabled={completed}
              onPress={() => markHabitDone(habit.id)}
            />
            );
          })}
        </View>
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
  },
  quickPanel: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    gap: 10,
    marginTop: 18
  },
  panelTitle: {
    ...FONTS.h3
  }
});
