import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { Screen } from "../components/Screen";
import { FONTS } from "../constants/typography";
import { useHabits } from "../context/HabitContext";
import { useTheme } from "../context/ThemeContext";

export default function OnboardingScreen() {
  const { completeOnboarding, loadSampleGarden } = useHabits();
  const { theme } = useTheme();

  async function startEmpty() {
    await completeOnboarding();
    router.replace("/home");
  }

  async function startWithDemo() {
    await loadSampleGarden();
    await completeOnboarding();
    router.replace("/home");
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.hero}>
        <View style={[styles.mark, { backgroundColor: theme.surfaceMuted }]}>
          <MaterialCommunityIcons name="sprout" size={62} color={theme.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Visual Habit Lab</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Build habits as living visual objects. Complete them, watch them level up, and keep your garden alive.
        </Text>
      </View>

      <View style={styles.actions}>
        <AppButton label="Start my garden" icon="plus" onPress={startEmpty} />
        <AppButton label="Load sample garden" icon="flask-outline" variant="secondary" onPress={startWithDemo} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between"
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 18
  },
  mark: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    ...FONTS.display,
    textAlign: "center"
  },
  subtitle: {
    ...FONTS.body,
    textAlign: "center",
    maxWidth: 420
  },
  actions: {
    gap: 12
  }
});
