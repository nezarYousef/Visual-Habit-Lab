import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { SAMPLE_HABITS } from "../features/habits/habit.mock";
import { createHabitFromDraft, markAsCompleted, validateHabitDraft } from "../features/habits/habit.logic";
import {
  getHabits,
  getOnboardingComplete,
  saveHabits,
  setOnboardingComplete as persistOnboardingComplete
} from "../features/habits/habit.storage";
import { Habit, HabitDraft } from "../features/habits/habit.types";
import { syncHabitCompletions } from "../features/habits/habitDb";

type HabitContextValue = {
  habits: Habit[];
  isReady: boolean;
  isSaving: boolean;
  error?: string;
  onboardingComplete: boolean;
  clearError: () => void;
  completeOnboarding: () => Promise<void>;
  addHabit: (draft: HabitDraft) => Promise<Habit>;
  updateHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  markHabitDone: (id: string) => Promise<void>;
  loadSampleGarden: () => Promise<void>;
  clearGarden: () => Promise<void>;
};

const HabitContext = createContext<HabitContextValue | undefined>(undefined);

export function HabitProvider({ children }: PropsWithChildren) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const habitsRef = useRef<Habit[]>([]);
  const [onboardingComplete, setOnboardingCompleteState] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const setHabitState = useCallback((nextHabits: Habit[]) => {
    habitsRef.current = nextHabits;
    setHabits(nextHabits);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      const [storedHabits, storedOnboarding] = await Promise.all([getHabits(), getOnboardingComplete()]);
      if (!mounted) return;

      setHabitState(storedHabits);
      setOnboardingCompleteState(storedOnboarding);
      setIsReady(true);
    }

    hydrate().catch(() => {
      setError("Could not load saved habits.");
      if (mounted) setIsReady(true);
    });

    return () => {
      mounted = false;
    };
  }, [setHabitState]);

  const replaceHabits = useCallback(async (nextHabits: Habit[]) => {
    setIsSaving(true);
    setError(undefined);
    const previousHabits = habitsRef.current;
    setHabitState(nextHabits);

    try {
      await saveHabits(nextHabits);
    } catch {
      setHabitState(previousHabits);
      setError("Could not save the latest habit changes.");
      throw new Error("Could not save the latest habit changes.");
    } finally {
      setIsSaving(false);
    }
  }, [setHabitState]);

  const addHabit = useCallback(
    async (draft: HabitDraft) => {
      const validationError = validateHabitDraft(draft, habitsRef.current);
      if (validationError) {
        setError(validationError);
        throw new Error(validationError);
      }

      const habit = createHabitFromDraft(draft);
      await replaceHabits([...habitsRef.current, habit]);
      return habit;
    },
    [replaceHabits]
  );

  const updateHabit = useCallback(
    async (habit: Habit) => {
      await replaceHabits(habitsRef.current.map((item) => (item.id === habit.id ? habit : item)));
    },
    [replaceHabits]
  );

  const deleteHabit = useCallback(
    async (id: string) => {
      await replaceHabits(habitsRef.current.filter((habit) => habit.id !== id));
    },
    [replaceHabits]
  );

  const markHabitDone = useCallback(
    async (id: string) => {
      const nextHabits = habitsRef.current.map((habit) => (habit.id === id ? markAsCompleted(habit) : habit));
      const updated = nextHabits.find((habit) => habit.id === id);
      await replaceHabits(nextHabits);
      if (updated) {
        syncHabitCompletions(updated).catch(() => undefined);
      }
    },
    [replaceHabits]
  );

  const completeOnboarding = useCallback(async () => {
    setOnboardingCompleteState(true);
    await persistOnboardingComplete(true);
  }, []);

  const loadSampleGarden = useCallback(async () => {
    await replaceHabits(SAMPLE_HABITS);
  }, [replaceHabits]);

  const clearGarden = useCallback(async () => {
    await replaceHabits([]);
  }, [replaceHabits]);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const value = useMemo<HabitContextValue>(
    () => ({
      habits,
      isReady,
      isSaving,
      error,
      onboardingComplete,
      clearError,
      completeOnboarding,
      addHabit,
      updateHabit,
      deleteHabit,
      markHabitDone,
      loadSampleGarden,
      clearGarden
    }),
    [
      habits,
      isReady,
      isSaving,
      error,
      onboardingComplete,
      clearError,
      completeOnboarding,
      addHabit,
      updateHabit,
      deleteHabit,
      markHabitDone,
      loadSampleGarden,
      clearGarden
    ]
  );

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits() {
  const value = useContext(HabitContext);
  if (!value) {
    throw new Error("useHabits must be used inside HabitProvider");
  }

  return value;
}
