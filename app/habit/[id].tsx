import { router, useLocalSearchParams } from "expo-router";
import { Alert, Platform } from "react-native";
import { HabitDetails } from "../../components/HabitDetails";
import { LoadingState } from "../../components/LoadingState";
import { Screen } from "../../components/Screen";
import { StatusBanner } from "../../components/StatusBanner";
import { useHabits } from "../../context/HabitContext";

export default function HabitDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits, markHabitDone, deleteHabit, error, clearError } = useHabits();
  const habit = habits.find((item) => item.id === id);

  if (!habit) {
    return (
      <Screen scroll={false}>
        <LoadingState />
      </Screen>
    );
  }

  const currentHabit = habit;

  function confirmDelete() {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Delete this habit from your garden?");
      if (confirmed) {
        deleteHabit(currentHabit.id).then(() => router.replace("/home"));
      }
      return;
    }

    Alert.alert("Delete habit", "This removes the habit from your garden.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteHabit(currentHabit.id);
          router.replace("/home");
        }
      }
    ]);
  }

  return (
    <Screen>
      {error ? <StatusBanner message={error} tone="danger" onDismiss={clearError} /> : null}
      <HabitDetails habit={currentHabit} onComplete={() => markHabitDone(currentHabit.id)} onDelete={confirmDelete} />
    </Screen>
  );
}
