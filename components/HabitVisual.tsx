import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from "react-native-svg";
import { HABIT_LEVELS, VISUAL_TYPES, VisualType } from "../constants/visuals";
import { HabitLevel, HabitStatus } from "../features/habits/habit.types";
import { useTheme } from "../context/ThemeContext";

type HabitVisualProps = {
  type: VisualType;
  level?: HabitLevel;
  status?: HabitStatus;
  size?: number;
  animated?: boolean;
  selected?: boolean;
};

export function HabitVisual({ type, level = 1, status = "healthy", size = 88, animated = true, selected = false }: HabitVisualProps) {
  const { theme } = useTheme();
  const motion = useRef(new Animated.Value(0)).current;
  const visual = VISUAL_TYPES[type];
  const dimmed = status === "fading";
  const warning = status === "at_risk";
  const scale = HABIT_LEVELS[level].scale;
  const statusColor = status === "healthy" ? visual.colors[1] : warning ? theme.warm : theme.danger;

  useEffect(() => {
    if (!animated) return undefined;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(motion, {
          toValue: 1,
          duration: status === "healthy" ? 1500 : 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(motion, {
          toValue: 0,
          duration: status === "healthy" ? 1500 : 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        })
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [animated, motion, status]);

  return (
    <Animated.View
      style={[
        styles.shell,
        {
          width: size,
          height: size,
          borderColor: selected ? theme.primary : statusColor,
          backgroundColor: theme.surface,
          opacity: dimmed ? 0.72 : 1,
          transform: [
            {
              scale: motion.interpolate({
                inputRange: [0, 1],
                outputRange: [scale, scale + (status === "healthy" ? 0.035 : 0.012)]
              })
            }
          ]
        }
      ]}
    >
      <View style={[styles.glow, { backgroundColor: selected ? theme.surfaceMuted : visual.colors[0], opacity: dimmed ? 0.32 : 0.52 }]} />
      <Svg width={size} height={size} viewBox="0 0 120 120">
        {type === "tree" ? <TreeArt level={level} warning={warning} /> : null}
        {type === "tower" ? <TowerArt level={level} warning={warning} /> : null}
        {type === "fountain" ? <FountainArt level={level} warning={warning} /> : null}
        {type === "book" ? <BookArt level={level} warning={warning} /> : null}
      </Svg>
    </Animated.View>
  );
}

function TreeArt({ level, warning }: { level: HabitLevel; warning: boolean }) {
  const leaf = warning ? "#D97706" : "#49A078";
  const deepLeaf = warning ? "#92400E" : "#23624A";
  const trunk = "#8B5E34";

  if (level === 1) {
    return (
      <G>
        <Ellipse cx="60" cy="96" rx="25" ry="8" fill="#DDE7DF" />
        <Line x1="60" y1="94" x2="60" y2="70" stroke={trunk} strokeWidth="6" strokeLinecap="round" />
        <Ellipse cx="51" cy="72" rx="14" ry="8" fill={leaf} rotation="-32" origin="51,72" />
        <Ellipse cx="69" cy="68" rx="15" ry="8" fill={deepLeaf} rotation="28" origin="69,68" />
      </G>
    );
  }

  return (
    <G>
      <Ellipse cx="60" cy="99" rx="32" ry="9" fill="#DDE7DF" />
      <Rect x="53" y={level >= 3 ? "52" : "62"} width="14" height={level >= 3 ? "43" : "33"} rx="7" fill={trunk} />
      <Path d="M60 78 C50 70 45 63 42 55" stroke={trunk} strokeWidth="5" strokeLinecap="round" fill="none" />
      <Path d="M61 74 C73 68 79 59 82 49" stroke={trunk} strokeWidth="5" strokeLinecap="round" fill="none" />
      <Circle cx="45" cy="54" r={level >= 4 ? "21" : "16"} fill={leaf} />
      <Circle cx="73" cy="47" r={level >= 4 ? "24" : "18"} fill={deepLeaf} />
      <Circle cx="59" cy="37" r={level >= 3 ? "25" : "18"} fill={leaf} />
      {level >= 4 ? <Circle cx="60" cy="37" r="8" fill="#F5B841" opacity="0.95" /> : null}
    </G>
  );
}

function TowerArt({ level, warning }: { level: HabitLevel; warning: boolean }) {
  const body = warning ? "#F5B841" : "#5DA9E9";
  const shade = warning ? "#B45309" : "#23624A";
  const floors = level + 1;

  return (
    <G>
      <Ellipse cx="60" cy="99" rx="30" ry="8" fill="#DDE7DF" />
      <Rect x="38" y={72 - level * 8} width="44" height={24 + level * 12} rx="6" fill={body} />
      <Path d={`M34 ${72 - level * 8} L60 ${50 - level * 7} L86 ${72 - level * 8} Z`} fill={shade} />
      {Array.from({ length: floors }).map((_, index) => (
        <Rect key={index} x={index % 2 === 0 ? "48" : "63"} y={76 - level * 7 + index * 10} width="8" height="7" rx="2" fill="#FFFFFF" opacity="0.82" />
      ))}
      {level >= 4 ? <Circle cx="60" cy="28" r="5" fill="#F5B841" /> : null}
    </G>
  );
}

function FountainArt({ level, warning }: { level: HabitLevel; warning: boolean }) {
  const water = warning ? "#F5B841" : "#5DA9E9";
  const deep = warning ? "#B45309" : "#2563EB";

  return (
    <G>
      <Ellipse cx="60" cy="96" rx="34" ry="10" fill={deep} opacity="0.88" />
      <Rect x="31" y="82" width="58" height="13" rx="7" fill={deep} />
      <Rect x="50" y="62" width="20" height="24" rx="8" fill={water} />
      <Path d={`M60 64 C${48 - level * 2} ${58 - level * 7} ${44 - level * 3} ${50 - level * 9} 43 ${42 - level * 8}`} stroke={water} strokeWidth="5" strokeLinecap="round" fill="none" />
      <Path d={`M60 64 C${72 + level * 2} ${58 - level * 7} ${76 + level * 3} ${50 - level * 9} 77 ${42 - level * 8}`} stroke={water} strokeWidth="5" strokeLinecap="round" fill="none" />
      {level >= 3 ? <Path d="M60 62 C58 48 59 38 60 28" stroke={water} strokeWidth="5" strokeLinecap="round" fill="none" /> : null}
      {level >= 4 ? <Circle cx="60" cy="25" r="5" fill="#F5B841" /> : null}
    </G>
  );
}

function BookArt({ level, warning }: { level: HabitLevel; warning: boolean }) {
  const cover = warning ? "#F5B841" : "#F07167";
  const shade = warning ? "#B45309" : "#9F1239";
  const pages = level >= 3 ? 5 : 3;

  return (
    <G>
      <Ellipse cx="60" cy="99" rx="34" ry="8" fill="#DDE7DF" />
      <Path d="M27 42 C40 35 50 38 60 47 L60 91 C49 82 39 80 27 86 Z" fill={cover} />
      <Path d="M93 42 C80 35 70 38 60 47 L60 91 C71 82 81 80 93 86 Z" fill={shade} />
      <Path d="M60 47 L60 91" stroke="#FFFFFF" strokeWidth="3" opacity="0.85" />
      {Array.from({ length: pages }).map((_, index) => (
        <Line key={index} x1="36" y1={55 + index * 7} x2="53" y2={59 + index * 6} stroke="#FFFFFF" strokeWidth="2" opacity="0.72" />
      ))}
      {level >= 4 ? <Circle cx="60" cy="35" r="6" fill="#F5B841" /> : null}
    </G>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderWidth: 2,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  glow: {
    ...StyleSheet.absoluteFillObject
  }
});
