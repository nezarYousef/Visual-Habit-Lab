import { addDays, toDateKey } from "../../utils/date";
import { Habit } from "./habit.types";

const today = new Date();

export const SAMPLE_HABITS: Habit[] = [
  {
    id: "sample-water",
    name: "Drink water",
    category: "Health",
    frequency: "daily",
    visualType: "fountain",
    createdAt: toDateKey(addDays(today, -12)),
    reminderTime: "09:00",
    completions: [0, -1, -2, -3, -5, -6].map((offset) => toDateKey(addDays(today, offset)))
  },
  {
    id: "sample-read",
    name: "Read ten pages",
    category: "Learning",
    frequency: "daily",
    visualType: "book",
    createdAt: toDateKey(addDays(today, -20)),
    completions: [0, -2, -4, -5, -6].map((offset) => toDateKey(addDays(today, offset)))
  },
  {
    id: "sample-walk",
    name: "Evening walk",
    category: "Fitness",
    frequency: "daily",
    visualType: "tree",
    createdAt: toDateKey(addDays(today, -9)),
    completions: [-1, -2, -3, -4, -5, -6].map((offset) => toDateKey(addDays(today, offset)))
  }
];
