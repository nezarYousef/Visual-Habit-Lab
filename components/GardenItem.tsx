import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { HABIT_LEVELS, VISUAL_TYPES } from "../constants/visuals";
import { FONTS } from "../constants/typography";
import { useTheme } from "../context/ThemeContext";
import { calculateHabitStreak, getHabitLevel, getHabitStatus, getLastCompletion } from "../features/habits/habit.logic";
import { Habit } from "../features/habits/habit.types";

type GardenItemProps = {
  habit: Habit;
  onPress: () => void;
};

export function GardenItem({ habit, onPress }: GardenItemProps) {
  const { theme } = useTheme();
  const visual = VISUAL_TYPES[habit.visualType];
  const streak = calculateHabitStreak(habit);
  const level = getHabitLevel(streak);
  const status = getHabitStatus(getLastCompletion(habit), habit.frequency);
  const statusColor = status === "healthy" ? visual.colors[1] : status === "at_risk" ? theme.warm : theme.danger;
  const size = 62 * HABIT_LEVELS[level].scale;
  const statusLabel = status === "healthy" ? "Healthy" : status === "at_risk" ? "At risk" : "Fading";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: pressed ? 0.78 : 1
        }
      ]}
    >
      <View style={[styles.iconShell, { width: size, height: size, borderColor: statusColor, backgroundColor: visual.colors[0] }]}>
        <MaterialCommunityIcons name={visual.icon} size={Math.max(28, size * 0.52)} color={visual.colors[1]} />
      </View>
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
  iconShell: {
    borderWidth: 2,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center"
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
