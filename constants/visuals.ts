import { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorValue } from "react-native";

export type VisualType = "tree" | "tower" | "fountain" | "book";
type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export const VISUAL_TYPES: Record<
  VisualType,
  {
    label: string;
    icon: IconName;
    colors: [ColorValue, ColorValue];
  }
> = {
  tree: {
    label: "Tree",
    icon: "tree",
    colors: ["#5FB878", "#23624A"]
  },
  tower: {
    label: "Tower",
    icon: "office-building",
    colors: ["#F5B841", "#B45309"]
  },
  fountain: {
    label: "Fountain",
    icon: "fountain",
    colors: ["#5DA9E9", "#2563EB"]
  },
  book: {
    label: "Book",
    icon: "book-open-page-variant",
    colors: ["#F07167", "#9F1239"]
  }
};

export const HABIT_LEVELS = {
  1: { name: "Seed", scale: 0.72 },
  2: { name: "Growing", scale: 0.88 },
  3: { name: "Mature", scale: 1 },
  4: { name: "Radiant", scale: 1.15 }
} as const;
