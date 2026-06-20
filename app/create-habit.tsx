import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { HabitForm } from "../components/HabitForm";
import { Screen } from "../components/Screen";
import { StatusBanner } from "../components/StatusBanner";
import { FONTS } from "../constants/typography";
import { useHabits } from "../context/HabitContext";
import { useTheme } from "../context/ThemeContext";
import { HabitDraft } from "../features/habits/habit.types";

export default function CreateHabitScreen() {
  const { habits, addHabit, error, clearError } = useHabits();
  const { theme } = useTheme();

  async function submit(draft: HabitDraft) {
    try {
      const habit = await addHabit(draft);
      router.replace(`/habit/${habit.id}`);
    } catch {
      return undefined;
    }
  }

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.text }]}>Create habit</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
        Choose a small repeatable action and the visual object it will grow into.
      </Text>
      {error ? <StatusBanner message={error} tone="danger" onDismiss={clearError} /> : null}
      <HabitForm existingHabitNames={habits.map((habit) => habit.name)} onSubmit={submit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...FONTS.h1,
    marginBottom: 6
  },
  subtitle: {
    ...FONTS.body,
    marginBottom: 22
  }
});
