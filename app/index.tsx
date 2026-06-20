import { Redirect } from "expo-router";
import { LoadingState } from "../components/LoadingState";
import { Screen } from "../components/Screen";
import { useHabits } from "../context/HabitContext";

export default function IndexScreen() {
  const { isReady, onboardingComplete } = useHabits();

  if (!isReady) {
    return (
      <Screen scroll={false}>
        <LoadingState />
      </Screen>
    );
  }

  return <Redirect href={onboardingComplete ? "/home" : "/onboarding"} />;
}
