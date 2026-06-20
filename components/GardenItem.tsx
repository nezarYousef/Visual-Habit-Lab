import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { HABIT_LEVELS, VISUAL_TYPES } from "../constants/visuals";
import { FONTS } from "../constants/typography";
import { useTheme } from "../context/ThemeContext";
import { calculateHabitStreak, getHabitLevel, getHabitStatus, getLastCompletion } from "../features/habits/habit.logic";
import { Habit } from "../features/habits/habit.types";
import { HabitVisual } from "./HabitVisual";

type GardenItemProps = {
  habit: Habit;
  onPress: () => void;
};

export function GardenItem({ habit, onPress }: GardenItemProps) {
  const { theme } = useTheme();
  const pressScale = useRef(new Animated.Value(1)).current;
  const visual = VISUAL_TYPES[habit.visualType];
  const streak = calculateHabitStreak(habit);
  const level = getHabitLevel(streak);
  const status = getHabitStatus(getLastCompletion(habit), habit.frequency);
  const statusColor = status === "healthy" ? visual.colors[1] : status === "at_risk" ? theme.warm : theme.danger;
  const size = 78 * HABIT_LEVELS[level].scale;
  const statusLabel = status === "healthy" ? "Healthy" : status === "at_risk" ? "At risk" : "Fading";

  function animatePress(toValue: number) {
    Animated.spring(pressScale, {
      toValue,
      speed: 24,
      bounciness: 7,
      useNativeDriver: true
    }).start();
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => animatePress(0.96)}
      onPressOut={() => animatePress(1)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: pressed ? 0.78 : 1
        }
      ]}
    >
      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <HabitVisual type={habit.visualType} level={level} status={status} size={size} />
      </Animated.View>
      <Text numberOfLines={1} style={[styles.name, { color: theme.text }]}>
        {habit.name}
      </Text>
      <Text style={[styles.meta, { color: theme.textMuted }]}>
        {streak} {habit.frequency === "weekly" ? "week" : "day"} streak
      </Text>
      <Text style={[styles.status, { color: statusColor }]}>{statusLabel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 158,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    gap: 8
  },
  name: {
    ...FONTS.h3,
    textAlign: "center"
  },
  meta: {
    ...FONTS.small,
    textAlign: "center"
  },
  status: {
    ...FONTS.small,
    textAlign: "center",
    textTransform: "uppercase"
  }
});
