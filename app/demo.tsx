import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { AppButton } from "../components/AppButton";
import { Screen } from "../components/Screen";
import { FONTS } from "../constants/typography";
import { useHabits } from "../context/HabitContext";
import { useTheme } from "../context/ThemeContext";

export default function DemoScreen() {
  const { loadSampleGarden, clearGarden } = useHabits();
  const { theme } = useTheme();

  async function load() {
    await loadSampleGarden();
    router.replace("/home");
  }

  async function clear() {
    await clearGarden();
    router.replace("/home");
  }

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.text }]}>Demo garden</Text>
      <Text style={[styles.body, { color: theme.textMuted }]}>
        Load realistic sample habits for screenshots, testing, and quick exploration.
      </Text>
      <AppButton label="Load sample garden" icon="flask-outline" onPress={load} />
      <AppButton label="Clear garden" icon="delete-sweep-outline" variant="danger" onPress={clear} />
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
  }
});
