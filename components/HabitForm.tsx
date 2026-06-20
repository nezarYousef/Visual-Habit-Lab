import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FONTS } from "../constants/typography";
import { useTheme } from "../context/ThemeContext";
import { HabitDraft, HabitFrequency } from "../features/habits/habit.types";
import { VisualType } from "../constants/visuals";
import { AppButton } from "./AppButton";
import { VisualSelector } from "./VisualSelector";
import { normalizeHabitName } from "../features/habits/habit.logic";

type HabitFormProps = {
  onSubmit: (draft: HabitDraft) => void;
  existingHabitNames?: string[];
};

const CATEGORIES = ["Health", "Learning", "Fitness", "Mind", "Work", "Custom"];

export function HabitForm({ onSubmit, existingHabitNames = [] }: HabitFormProps) {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0] ?? "Health");
  const [customCategory, setCustomCategory] = useState("");
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");
  const [visualType, setVisualType] = useState<VisualType>("tree");
  const [reminderTime, setReminderTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const cleanName = name.trim().replace(/\s+/g, " ");
  const cleanCategory = category === "Custom" ? customCategory.trim().replace(/\s+/g, " ") : category;
  const cleanReminderTime = reminderTime.trim();
  const duplicateName = existingHabitNames.some((item) => normalizeHabitName(item) === normalizeHabitName(cleanName));
  const reminderTimeValid = !cleanReminderTime || /^([01]\d|2[0-3]):[0-5]\d$/.test(cleanReminderTime);
  const nameValidationMessage =
    cleanName.length === 0
      ? "Name the habit before planting it."
      : cleanName.length < 2
        ? "Use at least 2 characters."
        : cleanName.length > 42
          ? "Keep the name under 42 characters."
          : duplicateName
            ? "A habit with this name already exists."
            : undefined;
  const categoryValidationMessage = category === "Custom" && cleanCategory.length < 2 ? "Name the custom category." : undefined;
  const validationMessage =
    nameValidationMessage ?? categoryValidationMessage ?? (!reminderTimeValid ? "Use 24-hour time, like 08:30." : undefined);
  const canSubmit = !validationMessage;

  function submit() {
    setSubmitted(true);
    if (!canSubmit) return;

    onSubmit({ name: cleanName, category: cleanCategory, frequency, visualType, reminderTime: cleanReminderTime });
  }

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Habit name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Morning stretch"
          placeholderTextColor={theme.textMuted}
          style={[styles.input, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border }]}
        />
        {(submitted || name.length > 0) && nameValidationMessage ? (
          <Text style={[styles.helper, { color: theme.danger }]}>{nameValidationMessage}</Text>
        ) : null}
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Category</Text>
        <View style={styles.chips}>
          {CATEGORIES.map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[
                styles.chip,
                {
                  borderColor: category === item ? theme.primary : theme.border,
                  backgroundColor: category === item ? theme.surfaceMuted : theme.surface
                }
              ]}
            >
              <Text style={[styles.chipText, { color: theme.text }]}>{item}</Text>
            </Pressable>
          ))}
        </View>
        {category === "Custom" ? (
          <>
            <TextInput
              value={customCategory}
              onChangeText={setCustomCategory}
              placeholder="Category name"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border }]}
            />
            {(submitted || customCategory.length > 0) && categoryValidationMessage ? (
              <Text style={[styles.helper, { color: theme.danger }]}>{categoryValidationMessage}</Text>
            ) : null}
          </>
        ) : null}
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Frequency</Text>
        <View style={[styles.segmented, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {(["daily", "weekly"] as HabitFrequency[]).map((item) => (
            <Pressable
              key={item}
              onPress={() => setFrequency(item)}
              style={[styles.segment, { backgroundColor: frequency === item ? theme.primary : "transparent" }]}
            >
              <Text style={[styles.segmentText, { color: frequency === item ? theme.surface : theme.text }]}>
                {item === "daily" ? "Daily" : "Weekly"}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.helper, { color: theme.textMuted }]}>
          {frequency === "daily" ? "Daily habits count one completion per day." : "Weekly habits count one completion per 7-day period."}
        </Text>
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Visual type</Text>
        <VisualSelector value={visualType} onChange={setVisualType} />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Reminder time</Text>
        <TextInput
          value={reminderTime}
          onChangeText={setReminderTime}
          placeholder="Optional, e.g. 08:30"
          placeholderTextColor={theme.textMuted}
          style={[styles.input, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border }]}
        />
        {(submitted || reminderTime.length > 0) && !reminderTimeValid ? (
          <Text style={[styles.helper, { color: theme.danger }]}>Use 24-hour time, like 08:30.</Text>
        ) : (
          <Text style={[styles.helper, { color: theme.textMuted }]}>Optional 24-hour reminder time.</Text>
        )}
      </View>

      <AppButton
        label="Create habit"
        icon="check"
        disabled={!canSubmit}
        onPress={submit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 20
  },
  field: {
    gap: 10
  },
  label: {
    ...FONTS.h3
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    ...FONTS.body
  },
  helper: {
    ...FONTS.small
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    minHeight: 40,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  chipText: {
    ...FONTS.small
  },
  segmented: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    flexDirection: "row"
  },
  segment: {
    flex: 1,
    minHeight: 40,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center"
  },
  segmentText: {
    ...FONTS.button
  }
});
