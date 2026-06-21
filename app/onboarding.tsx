import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { AppButton } from "../components/AppButton";
import { BrandMark } from "../components/BrandMark";
import { Screen } from "../components/Screen";
import { FONTS } from "../constants/typography";
import { useHabits } from "../context/HabitContext";
import { useTheme } from "../context/ThemeContext";

export default function OnboardingScreen() {
  const { completeOnboarding, loadSampleGarden } = useHabits();
  const { theme } = useTheme();
  const heroEntrance = useSharedValue(0);
  const actionsEntrance = useSharedValue(0);

  useEffect(() => {
    heroEntrance.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) });
    actionsEntrance.value = withDelay(220, withTiming(1, { duration: 460, easing: Easing.out(Easing.cubic) }));
  }, [actionsEntrance, heroEntrance]);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroEntrance.value,
    transform: [{ translateY: (1 - heroEntrance.value) * 18 }]
  }));

  const actionsStyle = useAnimatedStyle(() => ({
    opacity: actionsEntrance.value,
    transform: [{ translateY: (1 - actionsEntrance.value) * 14 }]
  }));

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
      <Animated.View style={[styles.hero, heroStyle]}>
        <BrandMark icon="sprout" size={108} />
        <Text style={[styles.title, { color: theme.text }]}>Visual Habit Lab</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Build habits as living visual objects. Complete them, watch them level up, and keep your garden alive.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.actions, actionsStyle]}>
        <AppButton label="Start my garden" icon="plus" onPress={startEmpty} />
        <AppButton label="Load sample garden" icon="flask-outline" variant="secondary" onPress={startWithDemo} />
      </Animated.View>
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