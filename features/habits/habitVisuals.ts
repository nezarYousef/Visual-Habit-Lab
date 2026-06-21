import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Habit } from "./habit.types";

export type HabitWorldZoneKey = "garden" | "library" | "productivity" | "wellness";
export type HabitWorldObjectKind =
  | "tree"
  | "plant"
  | "fountain"
  | "book"
  | "shelf"
  | "tower"
  | "desk"
  | "house"
  | "moon";

export type HabitWorldZone = {
  key: HabitWorldZoneKey;
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
  tint: string;
  matcher: string[];
};

export type HabitWorldPlacement = {
  habit: Habit;
  zone: HabitWorldZone;
  objectKind: HabitWorldObjectKind;
  x: number;
  y: number;
  layer: number;
};

export const HABIT_WORLD_ZONES: HabitWorldZone[] = [
  {
    key: "garden",
    title: "Garden Zone",
    icon: "sprout",
    color: "#4EB46D",
    tint: "#DFF6E7",
    matcher: ["health", "water", "exercise", "fitness", "walk", "run", "gym", "nutrition"]
  },
  {
    key: "library",
    title: "Library Zone",
    icon: "bookshelf",
    color: "#D8755E",
    tint: "#FFE6D9",
    matcher: ["reading", "read", "learning", "learn", "book", "language", "course"]
  },
  {
    key: "productivity",
    title: "Productivity Zone",
    icon: "office-building",
    color: "#4C8ED9",
    tint: "#DCEBFF",
    matcher: ["study", "work", "productivity", "focus", "writing", "code", "project"]
  },
  {
    key: "wellness",
    title: "Wellness Zone",
    icon: "weather-night",
    color: "#8D86D9",
    tint: "#ECE8FF",
    matcher: ["sleep", "mindfulness", "meditation", "calm", "journal", "wellness", "rest"]
  }
];

const GARDEN_ZONE = HABIT_WORLD_ZONES[0]!;
const LIBRARY_ZONE = HABIT_WORLD_ZONES[1]!;
const PRODUCTIVITY_ZONE = HABIT_WORLD_ZONES[2]!;

const ZONE_LAYOUT: Record<HabitWorldZoneKey, Array<{ x: number; y: number; layer: number }>> = {
  garden: [
    { x: 14, y: 69, layer: 3 },
    { x: 30, y: 62, layer: 2 },
    { x: 21, y: 51, layer: 1 }
  ],
  library: [
    { x: 66, y: 61, layer: 2 },
    { x: 82, y: 68, layer: 3 },
    { x: 74, y: 48, layer: 1 }
  ],
  productivity: [
    { x: 47, y: 45, layer: 1 },
    { x: 58, y: 39, layer: 0 },
    { x: 41, y: 55, layer: 2 }
  ],
  wellness: [
    { x: 70, y: 32, layer: 0 },
    { x: 84, y: 39, layer: 1 },
    { x: 58, y: 30, layer: 0 }
  ]
};

export function getHabitWorldPlacements(habits: Habit[], limit = 12): HabitWorldPlacement[] {
  const zoneCounts: Record<HabitWorldZoneKey, number> = {
    garden: 0,
    library: 0,
    productivity: 0,
    wellness: 0
  };

  return habits.slice(0, limit).map((habit, index) => {
    const zone = getHabitWorldZone(habit);
    const zonePositions = ZONE_LAYOUT[zone.key];
    const cycle = Math.floor(zoneCounts[zone.key] / zonePositions.length);
    const position = zonePositions[zoneCounts[zone.key] % zonePositions.length] ?? zonePositions[0]!;
    zoneCounts[zone.key] += 1;

    return {
      habit,
      zone,
      objectKind: getHabitWorldObjectKind(habit, zone.key, index),
      x: clamp(position.x + cycle * 4 - (cycle % 2) * 8, 8, 88),
      y: clamp(position.y + cycle * 5, 18, 78),
      layer: position.layer + cycle
    };
  });
}

export function getHabitWorldZone(habit: Habit): HabitWorldZone {
  const text = getHabitSearchText(habit);
  return HABIT_WORLD_ZONES.find((zone) => zone.matcher.some((term) => text.includes(term))) ?? getFallbackZone(habit);
}

export function getHabitWorldObjectKind(habit: Habit, zone: HabitWorldZoneKey, index = 0): HabitWorldObjectKind {
  const text = getHabitSearchText(habit);

  if (zone === "garden") {
    if (text.includes("water") || habit.visualType === "fountain") return "fountain";
    if (text.includes("exercise") || text.includes("health") || text.includes("fitness")) return index % 2 ? "plant" : "tree";
    return habit.visualType === "tree" ? "tree" : "plant";
  }

  if (zone === "library") {
    return text.includes("learn") || index % 2 ? "shelf" : "book";
  }

  if (zone === "productivity") {
    return text.includes("work") || habit.visualType === "tower" ? "tower" : "desk";
  }

  return text.includes("sleep") || index % 2 ? "house" : "moon";
}

function getFallbackZone(habit: Habit): HabitWorldZone {
  if (habit.visualType === "book") return LIBRARY_ZONE;
  if (habit.visualType === "tower") return PRODUCTIVITY_ZONE;
  return GARDEN_ZONE;
}

function getHabitSearchText(habit: Habit) {
  return `${habit.category} ${habit.name} ${habit.visualType}`.toLowerCase();
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
