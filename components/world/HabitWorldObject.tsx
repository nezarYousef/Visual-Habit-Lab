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
  withTiming,
  type SharedValue
} from "react-native-reanimated";
import { FONTS } from "../../constants/typography";
import { useTheme } from "../../context/ThemeContext";
import { withAlpha } from "../../utils/colors";
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

const SPARK_ANGLES = [-90, -30, 30, 90, 150, 210];

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
  const ringA = useSharedValue(0);
  const ringB = useSharedValue(0);
  const sparkle = useSharedValue(0);
  const dimmed = status === "fading";
  const size = getObjectSize(level, layer);
  const depthScale = 0.92 + Math.min(layer, 4) * 0.025;
  const glowColor = completed || level === 4 ? "#FFE08A" : getGlowColor(objectKind);

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
      withTiming(1, { duration: 110, easing: Easing.out(Easing.quad) }),
      withSpring(0, { damping: 7, stiffness: 130 })
    );

    ringA.value = 0;
    ringA.value = withTiming(1, { duration: 760, easing: Easing.out(Easing.cubic) });
    ringB.value = 0;
    ringB.value = withDelay(140, withTiming(1, { duration: 760, easing: Easing.out(Easing.cubic) }));

    sparkle.value = 0;
    sparkle.value = withDelay(40, withTiming(1, { duration: 620, easing: Easing.out(Easing.cubic) }));
  }, [celebrating, completion, ringA, ringB, sparkle]);

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

  const softGlowStyle = useAnimatedStyle(() => ({
    opacity:
      (completed || level === 4 ? 0.82 : status === "at_risk" ? 0.4 : 0.6) +
      interpolate(radiance.value, [0, 1], [0, level === 4 ? 0.16 : 0.06]),
    transform: [{ scale: interpolate(radiance.value, [0, 1], [0.92, level === 4 ? 1.16 : 1.04]) }]
  }));

  const ringAStyle = useAnimatedStyle(() => ({
    opacity: interpolate(ringA.value, [0, 0.15, 1], [0, 0.55, 0]),
    transform: [{ scale: interpolate(ringA.value, [0, 1], [0.5, 2.1]) }]
  }));

  const ringBStyle = useAnimatedStyle(() => ({
    opacity: interpolate(ringB.value, [0, 0.15, 1], [0, 0.4, 0]),
    transform: [{ scale: interpolate(ringB.value, [0, 1], [0.5, 1.7]) }]
  }));

  const labelPopStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + completion.value * 0.06 }]
  }));

  const doneIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + completion.value * 0.35 }]
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
      <View style={[styles.shadowOuter, { opacity: dimmed ? 0.07 : 0.14 + layer * 0.016, transform: [{ scaleX: 1.18 + layer * 0.05 }] }]} />
      <View style={[styles.shadowInner, { opacity: dimmed ? 0.13 : 0.24 + layer * 0.02, transform: [{ scaleX: 0.8 + layer * 0.035 }] }]} />

      <Animated.View style={[styles.softGlowWrap, softGlowStyle]}>
        <View style={[styles.glowRingOuter, { backgroundColor: glowColor }]} />
        <View style={[styles.glowRingMid, { backgroundColor: glowColor }]} />
        <View style={[styles.glowRingCore, { backgroundColor: glowColor }]} />
      </Animated.View>

      <Animated.View pointerEvents="none" style={[styles.burstRing, { borderColor: zone.color }, ringAStyle]} />
      <Animated.View pointerEvents="none" style={[styles.burstRing, styles.burstRingSmall, { borderColor: "#FFE08A" }, ringBStyle]} />

      <View pointerEvents="none" style={styles.sparkField}>
        {SPARK_ANGLES.map((angle, sparkIndex) => (
          <Spark key={angle} sparkle={sparkle} angle={angle} color={sparkIndex % 2 === 0 ? "#FFE08A" : zone.color} />
        ))}
      </View>

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

      <Animated.View style={[styles.labelPill, { backgroundColor: withAlpha(theme.surface, 0.88) }, labelPopStyle]}>
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
                opacity: completed ? 0.85 : 1
              }
            ]}
          >
            <Animated.View style={doneIconStyle}>
              <MaterialCommunityIcons name={completed ? "check" : "check-circle-outline"} size={15} color={completed ? "#FFFFFF" : zone.color} />
            </Animated.View>
          </Pressable>
        ) : null}
      </Animated.View>
    </Animated.View>
  );
});

function Spark({ sparkle, angle, color }: { sparkle: SharedValue<number>; angle: number; color: string }) {
  const radians = (angle * Math.PI) / 180;
  const dx = Math.cos(radians);
  const dy = Math.sin(radians);
  const distance = 44;

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(sparkle.value, [0, 0.12, 1], [0, 1, 0]),
    transform: [
      { translateX: dx * sparkle.value * distance },
      { translateY: dy * sparkle.value * distance },
      { scale: interpolate(sparkle.value, [0, 1], [0.5, 1]) }
    ]
  }));

  return <Animated.View style={[styles.spark, { backgroundColor: color }, style]} />;
}

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
  softGlowWrap: {
    position: "absolute",
    top: 9,
    width: 104,
    height: 104,
    alignItems: "center",
    justifyContent: "center"
  },
  glowRingOuter: {
    position: "absolute",
    width: 104,
    height: 104,
    borderRadius: 52,
    opacity: 0.2
  },
  glowRingMid: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    opacity: 0.3
  },
  glowRingCore: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.46
  },
  burstRing: {
    position: "absolute",
    top: 17,
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2.5
  },
  burstRingSmall: {
    top: 23,
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2
  },
  sparkField: {
    position: "absolute",
    top: 61,
    width: 1,
    height: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  spark: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3
  },
  shadowOuter: {
    position: "absolute",
    top: 73,
    width: 96,
    height: 24,
    borderRadius: 999,
    backgroundColor: "#0A211F"
  },
  shadowInner: {
    position: "absolute",
    top: 80,
    width: 58,
    height: 13,
    borderRadius: 999,
    backgroundColor: "#0A211F"
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
    borderColor: "rgba(255,255,255,0.3)",
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