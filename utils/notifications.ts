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
