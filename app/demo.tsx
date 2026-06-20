import { router } from "expo-router";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { Screen } from "../components/Screen";
import { StatCard } from "../components/StatCard";
import { FONTS } from "../constants/typography";
import { useHabits } from "../context/HabitContext";
import { useTheme } from "../context/ThemeContext";
import { SAMPLE_HABITS } from "../features/habits/habit.mock";
import { getHabitStats } from "../features/habits/habit.logic";

export default function DemoScreen() {
  const { loadSampleGarden, clearGarden } = useHabits();
  const { theme } = useTheme();
  const stats = getHabitStats(SAMPLE_HABITS);

  async function load() {
    await loadSampleGarden();
    router.replace("/home");
  }

  async function clear() {
    await clearGarden();
    router.replace("/home");
  }

  function confirmClear() {
    if (Platform.OS === "web") {
      if (window.confirm("Clear every habit from the garden?")) {
        clear();
      }
      return;
    }

    Alert.alert("Clear garden", "This removes every habit from the local garden.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: clear }
    ]);
  }

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.text }]}>Demo garden</Text>
      <Text style={[styles.body, { color: theme.textMuted }]}>
        Load realistic sample habits for screenshots, testing, and quick exploration.
      </Text>
      <View style={styles.grid}>
        <StatCard label="Sample habits" value={`${stats.activeHabits}`} icon="flask-outline" />
        <StatCard label="Avg completion" value={`${stats.averageWeeklyCompletion}%`} icon="chart-line" />
      </View>
      <AppButton label="Load sample garden" icon="flask-outline" onPress={load} />
      <AppButton label="Clear garden" icon="delete-sweep-outline" variant="danger" onPress={confirmClear} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...FONTS.h1,
    marginBottom: 8
  },
  body: {
    ...FONTS.body,
    marginBottom: 20
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18
  }
});
