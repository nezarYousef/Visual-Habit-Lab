import { useEffect, useMemo, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FONTS } from "../constants/typography";
import { VisualType } from "../constants/visuals";
import { useTheme } from "../context/ThemeContext";
import { calculateHabitStreak, getHabitLevel, getHabitStatus, getLastCompletion } from "../features/habits/habit.logic";
import { Habit } from "../features/habits/habit.types";
import { HabitVisual } from "./HabitVisual";

type HabitWorldsProps = {
  habits: Habit[];
  onSelectHabit: (id: string) => void;
};

type WorldDefinition = {
  type: VisualType;
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  empty: string;
};

const WORLDS: WorldDefinition[] = [
  { type: "tree", title: "Garden", icon: "pine-tree", empty: "No trees planted yet" },
  { type: "book", title: "Library", icon: "bookshelf", empty: "No books on the shelves yet" },
  { type: "fountain", title: "Fountain Court", icon: "fountain", empty: "No fountains flowing yet" },
  { type: "tower", title: "Skyline", icon: "city-variant-outline", empty: "No towers rising yet" }
];

const POSITIONS = [
  { left: "8%", bottom: 18 },
  { left: "34%", bottom: 32 },
  { left: "63%", bottom: 17 },
  { left: "20%", bottom: 82 },
  { left: "54%", bottom: 88 },
  { left: "76%", bottom: 70 }
] as const;

export function HabitWorlds({ habits, onSelectHabit }: HabitWorldsProps) {
  const grouped = useMemo(
    () =>
      WORLDS.map((world) => ({
        ...world,
        habits: habits.filter((habit) => habit.visualType === world.type)
      })),
    [habits]
  );

  return (
    <View style={styles.container}>
      {grouped.map((world, index) => (
        <WorldScene key={world.type} world={world} index={index} onSelectHabit={onSelectHabit} />
      ))}
    </View>
  );
}

function WorldScene({
  world,
  index,
  onSelectHabit
}: {
  world: WorldDefinition & { habits: Habit[] };
  index: number;
  onSelectHabit: (id: string) => void;
}) {
  const { theme } = useTheme();
  const entrance = useRef(new Animated.Value(0)).current;
  const isEmpty = world.habits.length === 0;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 340,
      delay: index * 80,
      useNativeDriver: true
    }).start();
  }, [entrance, index]);

  return (
    <Animated.View
      style={[
        styles.world,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: entrance,
          transform: [
            {
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0]
              })
            }
          ]
        }
      ]}
    >
      <View style={styles.worldHeader}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name={world.icon} size={22} color={theme.primary} />
          <Text style={[styles.worldTitle, { color: theme.text }]}>{world.title}</Text>
        </View>
        <Text style={[styles.worldCount, { color: theme.textMuted }]}>{world.habits.length}</Text>
      </View>

      <View style={[styles.stage, getStageStyle(world.type)]}>
        <WorldBackdrop type={world.type} />
        {isEmpty ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>{world.empty}</Text>
          </View>
        ) : (
          world.habits.slice(0, POSITIONS.length).map((habit, habitIndex) => (
            <WorldHabit
              key={habit.id}
              habit={habit}
              position={POSITIONS[habitIndex] ?? POSITIONS[0]}
              onPress={() => onSelectHabit(habit.id)}
            />
          ))
        )}
      </View>
    </Animated.View>
  );
}

function WorldBackdrop({ type }: { type: VisualType }) {
  if (type === "tree") {
    return (
      <>
        <View style={[styles.hill, styles.hillBack]} />
        <View style={[styles.hill, styles.hillFront]} />
      </>
    );
  }

  if (type === "book") {
    return (
      <>
        <View style={[styles.shelf, { bottom: 35 }]} />
        <View style={[styles.shelf, { bottom: 94 }]} />
      </>
    );
  }

  if (type === "fountain") {
    return (
      <>
        <View style={styles.courtCircle} />
        <View style={styles.courtPath} />
      </>
    );
  }

  return (
    <>
      <View style={[styles.skylineBlock, { left: "6%", height: 54 }]} />
      <View style={[styles.skylineBlock, { left: "26%", height: 78 }]} />
      <View style={[styles.skylineBlock, { left: "70%", height: 64 }]} />
    </>
  );
}

function WorldHabit({
  habit,
  position,
  onPress
}: {
  habit: Habit;
  position: (typeof POSITIONS)[number];
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const streak = calculateHabitStreak(habit);
  const level = getHabitLevel(streak);
  const status = getHabitStatus(getLastCompletion(habit), habit.frequency);
  const size = 58 + level * 8;

  function animate(toValue: number) {
    Animated.spring(scale, {
      toValue,
      speed: 26,
      bounciness: 8,
      useNativeDriver: true
    }).start();
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => animate(0.93)}
      onPressOut={() => animate(1)}
      style={[styles.worldHabit, { left: position.left, bottom: position.bottom }]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <HabitVisual type={habit.visualType} level={level} status={status} size={size} />
      </Animated.View>
      <Text numberOfLines={1} style={[styles.habitLabel, { color: theme.text }]}>
        {habit.name}
      </Text>
    </Pressable>
  );
}

function getStageStyle(type: VisualType) {
  if (type === "tree") return styles.gardenStage;
  if (type === "book") return styles.libraryStage;
  if (type === "fountain") return styles.fountainStage;
  return styles.skylineStage;
}

const styles = StyleSheet.create({
  container: {
    gap: 16
  },
  world: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    gap: 12,
    overflow: "hidden"
  },
  worldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  worldTitle: {
    ...FONTS.h3
  },
  worldCount: {
    ...FONTS.small
  },
  stage: {
    height: 220,
    borderRadius: 8,
    overflow: "hidden"
  },
  gardenStage: {
    backgroundColor: "#DFF3E7"
  },
  libraryStage: {
    backgroundColor: "#F5E6D3"
  },
  fountainStage: {
    backgroundColor: "#DCEFFC"
  },
  skylineStage: {
    backgroundColor: "#E4ECF7"
  },
  hill: {
    position: "absolute",
    borderRadius: 999
  },
  hillBack: {
    width: "90%",
    height: 110,
    left: "-8%",
    bottom: -42,
    backgroundColor: "#A7D7A8"
  },
  hillFront: {
    width: "105%",
    height: 98,
    right: "-18%",
    bottom: -36,
    backgroundColor: "#73B879"
  },
  shelf: {
    position: "absolute",
    left: 14,
    right: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#9A6A43"
  },
  courtCircle: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    left: "50%",
    bottom: -80,
    marginLeft: -95,
    backgroundColor: "#B9DCF2"
  },
  courtPath: {
    position: "absolute",
    width: 80,
    height: 230,
    left: "50%",
    bottom: -68,
    marginLeft: -40,
    backgroundColor: "#C9E4F6",
    transform: [{ rotate: "18deg" }]
  },
  skylineBlock: {
    position: "absolute",
    width: "18%",
    bottom: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: "#C6D4E4",
    opacity: 0.7
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 18
  },
  emptyText: {
    ...FONTS.small,
    textAlign: "center"
  },
  worldHabit: {
    position: "absolute",
    width: 92,
    alignItems: "center",
    gap: 4
  },
  habitLabel: {
    ...FONTS.small,
    maxWidth: 92,
    textAlign: "center"
  }
});
