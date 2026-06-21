import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { FONTS } from "../../constants/typography";
import { useTheme } from "../../context/ThemeContext";
import { getHabitWorldProgress } from "../../features/habits/habitProgress";
import { Habit } from "../../features/habits/habit.types";
import { HABIT_WORLD_ZONES, getHabitWorldPlacements } from "../../features/habits/habitVisuals";
import { CategoryZone } from "./CategoryZone";
import { CloudLayer } from "./CloudLayer";
import { FloatingParticles } from "./FloatingParticles";
import { HabitWorldObject } from "./HabitWorldObject";
import { WorldBackground } from "./WorldBackground";

type HomeWorldProps = {
  habits: Habit[];
  onSelectHabit: (id: string) => void;
  onCompleteHabit: (id: string) => Promise<void>;
};

export function HomeWorld({ habits, onSelectHabit, onCompleteHabit }: HomeWorldProps) {
  const { width } = useWindowDimensions();
  const { themeName } = useTheme();
  const [celebratingId, setCelebratingId] = useState<string | undefined>();
  const placements = useMemo(() => getHabitWorldPlacements(habits), [habits]);
  const progressById = useMemo(
    () => new Map(habits.map((habit) => [habit.id, getHabitWorldProgress(habit)])),
    [habits]
  );
  const worldHeight = Math.min(590, Math.max(490, width * 1.42));
  const hasFountain = placements.some((item) => item.objectKind === "fountain");
  const completedCount = habits.filter((habit) => progressById.get(habit.id)?.completed).length;

  async function completeHabit(habit: Habit) {
    const progress = progressById.get(habit.id);
    if (progress?.completed) return;

    setCelebratingId(habit.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    await onCompleteHabit(habit.id);
    setTimeout(() => setCelebratingId((current) => (current === habit.id ? undefined : current)), 900);
  }

  return (
    <View style={styles.container}>
      <WorldBackground dark={themeName === "dark"} height={worldHeight}>
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.kicker, { color: themeName === "dark" ? "#A9E4FF" : "#276E63" }]}>Today's world</Text>
            <Text style={[styles.title, { color: themeName === "dark" ? "#F4F7F5" : "#17382E" }]}>Visual Habit Lab</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Create habit"
            onPress={() => router.push("/create-habit")}
            style={({ pressed }) => [styles.addButton, { opacity: pressed ? 0.78 : 1 }]}
          >
            <MaterialCommunityIcons name="plus" size={22} color="#17382E" />
          </Pressable>
        </View>

        <CloudLayer />
        <FloatingParticles hasFountain={hasFountain} />

        {HABIT_WORLD_ZONES.map((zone) => {
          const count = placements.filter((item) => item.zone.key === zone.key).length;
          return <CategoryZone key={zone.key} zone={zone} count={count} active={count > 0} />;
        })}

        {habits.length === 0 ? (
          <View style={styles.emptyWorld}>
            <MaterialCommunityIcons name="sprout-outline" size={34} color="#276E63" />
            <Text style={styles.emptyTitle}>Plant your first habit</Text>
            <Text style={styles.emptyText}>Create a habit and this landscape will start growing around it.</Text>
          </View>
        ) : (
          placements.map((placement, index) => {
            const progress = progressById.get(placement.habit.id) ?? getHabitWorldProgress(placement.habit);

            return (
              <HabitWorldObject
                key={placement.habit.id}
                habit={placement.habit}
                level={progress.level}
                status={progress.status}
                onPress={() => onSelectHabit(placement.habit.id)}
                objectKind={placement.objectKind}
                zone={placement.zone}
                x={placement.x}
                y={placement.y}
                layer={placement.layer}
                index={index}
                completed={progress.completed}
                celebrating={celebratingId === placement.habit.id}
                onComplete={() => completeHabit(placement.habit)}
              />
            );
          })
        )}

        <View style={styles.progressDock}>
          <Text style={styles.progressValue}>
            {completedCount}/{habits.length || 0}
          </Text>
          <Text style={styles.progressLabel}>complete</Text>
        </View>
      </WorldBackground>

      <View style={styles.zoneGrid}>
        {HABIT_WORLD_ZONES.map((zone) => {
          const count = placements.filter((item) => item.zone.key === zone.key).length;
          return <CategoryZone key={zone.key} zone={zone} count={count} mode="chip" />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 18
  },
  topBar: {
    zIndex: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "rgba(255, 248, 233, 0.24)"
  },
  kicker: {
    ...FONTS.small,
    textTransform: "uppercase"
  },
  title: {
    ...FONTS.h1
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF8E9",
    shadowColor: "#102A2B",
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4
  },
  emptyWorld: {
    position: "absolute",
    left: 32,
    right: 32,
    bottom: 98,
    zIndex: 20,
    alignItems: "center",
    gap: 7,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 248, 233, 0.82)"
  },
  emptyTitle: {
    ...FONTS.h3,
    color: "#17382E",
    textAlign: "center"
  },
  emptyText: {
    ...FONTS.small,
    color: "#48645B",
    textAlign: "center"
  },
  progressDock: {
    position: "absolute",
    zIndex: 31,
    right: 16,
    bottom: 16,
    minWidth: 82,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(23, 56, 46, 0.78)",
    alignItems: "center",
    shadowColor: "#102A2B",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5
  },
  progressValue: {
    ...FONTS.h3,
    color: "#FFF8E9"
  },
  progressLabel: {
    ...FONTS.small,
    color: "#CFEFFF",
    fontSize: 11,
    lineHeight: 14,
    textTransform: "uppercase"
  },
  zoneGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(39, 110, 99, 0.16)",
    backgroundColor: "rgba(255,255,255,0.32)"
  }
});
