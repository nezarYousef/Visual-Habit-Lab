import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleHabitReminder(title: string, hour: number, minute: number): Promise<string | undefined> {
  const granted = await requestNotificationPermission();
  if (!granted) return undefined;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Habit reminder",
      body: title
    },
    trigger: {
      hour,
      minute,
      repeats: true
    } as Notifications.NotificationTriggerInput
  });
}

export function parseReminderTime(value?: string): { hour: number; minute: number } | undefined {
  if (!value) return undefined;

  const match = value.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) return undefined;

  return {
    hour: Number(match[1]),
    minute: Number(match[2])
  };
}
