import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming
} from "react-native-reanimated";
import { FONTS } from "../../constants/typography";
import { useTheme } from "../../context/ThemeContext";
import { getHabitWorldProgress } from "../../features/habits/habitProgress";
import { Habit } from "../../features/habits/habit.types";
import { HABIT_WORLD_ZONES, getHabitWorldPlacements } from "../../features/habits/habitVisuals";
import { CategoryZone } from "./CategoryZone";
import { CloudLayer } from "./CloudLayer";
import { FloatingParticles } from "./FloatingParticles";
import { HabitWorldObject } from "./HabitWorldObject";
import { ProgressDock } from "./ProgressDock";
import { WorldBackground } from "./WorldBackground";

type HomeWorldProps = {
  habits: Habit[];
  onSelectHabit: (id: string) => void;
  onCompleteHabit: (id: string) => Promise<void>;
};

// ── Add Habit Button ────────────────────────────────────────────────────────
function AddHabitButton({ isEmpty }: { isEmpty: boolean }) {
  const press = useSharedValue(1);
  const halo = useSharedValue(0);

  useEffect(() => {
    if (!isEmpty) {
      halo.value = 0;
      return;
    }
    halo.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [halo, isEmpty]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: press.value }]
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: interpolate(halo.value, [0, 1], [0, 0.38]),
    transform: [{ scale: interpolate(halo.value, [0, 1], [1, 1.62]) }]
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Create habit"
      onPress={() => router.push("/create-habit")}
      onPressIn={() => { press.value = withSpring(0.91); }}
      onPressOut={() => { press.value = withSpring(1); }}
    >
      <Animated.View style={buttonStyle}>
        {isEmpty ? <Animated.View style={[styles.addButtonHalo, haloStyle]} /> : null}
        <View style={styles.addButton}>
          <MaterialCommunityIcons name="plus" size={22} color="#17382E" />
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
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
  const isEmpty = habits.length === 0;

  const dark = themeName === "dark";
  const kickerColor = dark ? "#A9E4FF" : "#276E63";
  const titleColor = dark ? "#F4F7F5" : "#17382E";

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
      <WorldBackground dark={dark} height={worldHeight}>

        {/* ── Top bar ── */}
        <View style={styles.topBar}>
          <View style={styles.topBarBrand}>
            <View style={styles.brandBadge}>
              <MaterialCommunityIcons name="sprout" size={16} color="#1D7752" />
            </View>
            <View>
              <Text style={[styles.kicker, { color: kickerColor }]}>Today's world</Text>
              <Text style={[styles.title, { color: titleColor }]}>Visual Habit Lab</Text>
            </View>
          </View>
          <AddHabitButton isEmpty={isEmpty} />
        </View>

        <CloudLayer />
        <FloatingParticles hasFountain={hasFountain} />

        {/* ── Zone labels (absolute-positioned inside the world canvas) ── */}
        {HABIT_WORLD_ZONES.map((zone) => {
          const count = placements.filter((item) => item.zone.key === zone.key).length;
          return <CategoryZone key={zone.key} zone={zone} count={count} active={count > 0} />;
        })}

        {/* ── World content: empty state or habit objects ── */}
        {isEmpty ? (
          <View style={styles.emptyWorld}>
            <View style={styles.emptyBadge}>
              <MaterialCommunityIcons name="sprout-outline" size={30} color="#276E63" />
            </View>
            <Text style={styles.emptyTitle}>Your world is waiting</Text>
            <Text style={styles.emptyText}>
              Plant a habit and watch this landscape grow, season by season, completion by completion.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/create-habit")}
              style={styles.emptyAction}
            >
              <MaterialCommunityIcons name="plus" size={15} color="#17382E" />
              <Text style={styles.emptyActionText}>Plant your first habit</Text>
            </Pressable>
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

        {/* ── Progress dock (animated ring) ── */}
        <ProgressDock completed={completedCount} total={habits.length} />
      </WorldBackground>

      {/* ── Zone chip grid ── */}
      <View style={styles.zoneSection}>
        <Text style={styles.zoneSectionTitle}>Habitat zones</Text>
        <View style={styles.zoneGrid}>
          {HABIT_WORLD_ZONES.map((zone) => {
            const zonePlacements = placements.filter((item) => item.zone.key === zone.key);
            const count = zonePlacements.length;
            const completedInZone = zonePlacements.filter(
              (item) => progressById.get(item.habit.id)?.completed
            ).length;
            return (
              <CategoryZone
                key={zone.key}
                zone={zone}
                count={count}
                completed={completedInZone}
                mode="chip"
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 18
  },
  // ── Top bar
  topBar: {
    zIndex: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.32)",
    backgroundColor: "rgba(255, 248, 233, 0.26)"
  },
  topBarBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  brandBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,248,233,0.78)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.48)",
    shadowColor: "#102A2B",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  },
  kicker: {
    ...FONTS.small,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  title: {
    ...FONTS.h1
  },
  // ── Add button
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
  addButtonHalo: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFE08A"
  },
  // ── Empty world
  emptyWorld: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 88,
    zIndex: 20,
    alignItems: "center",
    gap: 8,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.48)",
    backgroundColor: "rgba(255, 248, 233, 0.88)"
  },
  emptyBadge: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(78, 180, 109, 0.14)",
    marginBottom: 2
  },
  emptyTitle: {
    ...FONTS.h3,
    color: "#17382E",
    textAlign: "center"
  },
  emptyText: {
    ...FONTS.small,
    color: "#48645B",
    textAlign: "center",
    lineHeight: 18
  },
  emptyAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#FFF8E9",
    borderWidth: 1,
    borderColor: "rgba(29,119,82,0.26)"
  },
  emptyActionText: {
    ...FONTS.button,
    fontSize: 13,
    color: "#17382E"
  },
  // ── Zone chips
  zoneSection: {
    gap: 8
  },
  zoneSectionTitle: {
    ...FONTS.small,
    color: "#48645B",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 2
  },
  zoneGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  }
});