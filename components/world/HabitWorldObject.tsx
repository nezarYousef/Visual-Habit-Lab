import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from "react-native-reanimated";
import { FONTS } from "../../constants/typography";
import { useTheme } from "../../context/ThemeContext";
import { Habit, HabitLevel, HabitStatus } from "../../features/habits/habit.types";
import { HabitWorldObjectKind, HabitWorldZone } from "../../features/habits/habitVisuals";
import { BookVisual } from "./visuals/BookVisual";
import { FountainVisual } from "./visuals/FountainVisual";
import { TowerVisual } from "./visuals/TowerVisual";
import { TreeVisual } from "./visuals/TreeVisual";
import { WellnessVisual } from "./visuals/WellnessVisual";

type HabitWorldObjectProps = {
  habit: Habit;
  level: HabitLevel;
  status: HabitStatus;
  onPress: () => void;
  objectKind: HabitWorldObjectKind;
  zone: HabitWorldZone;
  x: number;
  y: number;
  layer: number;
  index: number;
  completed: boolean;
  celebrating?: boolean;
  onComplete?: () => void;
};

export const HabitWorldObject = memo(function HabitWorldObject({
  habit,
  level,
  status,
  onPress,
  objectKind,
  zone,
  x,
  y,
  layer,
  index,
  completed,
  celebrating = false,
  onComplete
}: HabitWorldObjectProps) {
  const { theme } = useTheme();
  const entrance = useSharedValue(0);
  const idle = useSharedValue(0);
  const breath = useSharedValue(0);
  const radiance = useSharedValue(0);
  const press = useSharedValue(1);
  const completion = useSharedValue(0);
  const dimmed = status === "fading";
  const size = getObjectSize(level, layer);
  const depthScale = 0.92 + Math.min(layer, 4) * 0.025;

  useEffect(() => {
    entrance.value = withDelay(index * 55, withSpring(1, { damping: 13, stiffness: 95 }));
    idle.value = withDelay(
      index * 170,
      withRepeat(withTiming(1, { duration: 2600 + index * 140, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
    breath.value = withDelay(
      index * 120,
      withRepeat(withTiming(1, { duration: status === "healthy" ? 2400 : 3400, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
    radiance.value = withDelay(
      index * 90,
      withRepeat(withTiming(1, { duration: 2100, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
  }, [breath, entrance, idle, index, radiance, status]);

  useEffect(() => {
    if (!celebrating) return;
    completion.value = withSequence(
      withTiming(1, { duration: 120, easing: Easing.out(Easing.quad) }),
      withSpring(0, { damping: 8, stiffness: 115 })
    );
  }, [celebrating, completion]);

  const objectStyle = useAnimatedStyle(() => ({
    opacity: interpolate(entrance.value, [0, 1], [0, dimmed ? 0.62 : 1]),
    transform: [
      { translateY: interpolate(entrance.value, [0, 1], [22, 0]) },
      { rotate: `${interpolate(idle.value, [0, 1], [-1.1, 1.1])}deg` },
      {
        scale:
          depthScale *
          (press.value +
            completion.value * 0.18 +
            interpolate(breath.value, [0, 1], [0, status === "healthy" ? 0.025 : 0.008]))
      }
    ]
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(completion.value, [0, 1], [level === 4 ? 0.2 : 0, 0.72]),
    transform: [{ scale: interpolate(completion.value, [0, 1], [level === 4 ? 1.08 : 0.62, 1.5]) }]
  }));

  const softGlowStyle = useAnimatedStyle(() => ({
    opacity:
      (completed || level === 4 ? 0.34 : status === "at_risk" ? 0.12 : 0.18) +
      interpolate(radiance.value, [0, 1], [0, level === 4 ? 0.22 : 0.04]),
    transform: [{ scale: interpolate(radiance.value, [0, 1], [0.92, level === 4 ? 1.18 : 1.04]) }]
  }));

  return (
    <Animated.View
      style={[
        styles.anchor,
        {
          left: `${x}%`,
          top: `${y}%`,
          zIndex: 10 + layer
        },
        objectStyle
      ]}
    >
      <Animated.View style={[styles.completionGlow, { backgroundColor: zone.color }, glowStyle]} />
      <Animated.View
        style={[
          styles.softGlow,
          {
            backgroundColor: completed || level === 4 ? "#FFE08A" : getGlowColor(objectKind)
          },
          softGlowStyle
        ]}
      />
      <View style={[styles.groundShadow, { opacity: dimmed ? 0.12 : 0.22 + layer * 0.025, transform: [{ scaleX: 0.9 + layer * 0.04 }] }]} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${habit.name} details`}
        onPress={onPress}
        onPressIn={() => {
          press.value = withSpring(0.94);
        }}
        onPressOut={() => {
          press.value = withSpring(1);
        }}
        style={styles.objectPressable}
      >
        <ObjectVisual objectKind={objectKind} level={level} status={status} size={size} />
      </Pressable>
      <View style={[styles.labelPill, { backgroundColor: theme.surface }]}>
        <Text numberOfLines={1} style={[styles.habitName, { color: theme.text }]}>
          {habit.name}
        </Text>
        {onComplete ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Mark ${habit.name} done`}
            disabled={completed}
            onPress={onComplete}
            style={[
              styles.doneButton,
              {
                backgroundColor: completed ? zone.color : theme.surfaceMuted,
                opacity: completed ? 0.82 : 1
              }
            ]}
          >
            <MaterialCommunityIcons name={completed ? "check" : "check-circle-outline"} size={15} color={completed ? "#FFFFFF" : zone.color} />
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
});

function ObjectVisual({
  objectKind,
  level,
  status,
  size
}: {
  objectKind: HabitWorldObjectKind;
  level: HabitLevel;
  status: HabitStatus;
  size: number;
}) {
  if (objectKind === "tree" || objectKind === "plant") {
    return <TreeVisual level={level} status={status} size={size} variant={objectKind} />;
  }

  if (objectKind === "book" || objectKind === "shelf") {
    return <BookVisual level={level} status={status} size={size} variant={objectKind} />;
  }

  if (objectKind === "fountain") {
    return <FountainVisual level={level} status={status} size={size} />;
  }

  if (objectKind === "tower" || objectKind === "desk") {
    return <TowerVisual level={level} status={status} size={size} variant={objectKind} />;
  }

  return <WellnessVisual level={level} status={status} size={size} variant={objectKind} />;
}

function getObjectSize(level: HabitLevel, layer: number) {
  return 74 + level * 9 + Math.min(layer, 3) * 3;
}

function getGlowColor(kind: HabitWorldObjectKind) {
  if (kind === "book" || kind === "shelf") return "#F7A989";
  if (kind === "tower" || kind === "desk") return "#93C9FF";
  if (kind === "house" || kind === "moon") return "#FFF1A8";
  if (kind === "fountain") return "#79D5FF";
  return "#74D99A";
}

const styles = StyleSheet.create({
  anchor: {
    position: "absolute",
    width: 126,
    marginLeft: -63,
    alignItems: "center"
  },
  objectPressable: {
    alignItems: "center",
    justifyContent: "center"
  },
  softGlow: {
    position: "absolute",
    top: 9,
    width: 104,
    height: 104,
    borderRadius: 52
  },
  groundShadow: {
    position: "absolute",
    top: 78,
    width: 72,
    height: 18,
    borderRadius: 999,
    backgroundColor: "#102A2B"
  },
  completionGlow: {
    position: "absolute",
    top: 11,
    width: 92,
    height: 92,
    borderRadius: 46
  },
  labelPill: {
    minWidth: 92,
    maxWidth: 126,
    minHeight: 30,
    borderRadius: 8,
    paddingLeft: 9,
    paddingRight: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    shadowColor: "#102A2B",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  },
  habitName: {
    ...FONTS.small,
    flexShrink: 1
  },
  doneButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  }
});
