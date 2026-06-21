import { StyleSheet, Text, View } from "react-native";
import { FONTS } from "../constants/typography";
import { useTheme } from "../context/ThemeContext";
import { AppButton } from "./AppButton";
import { BrandMark } from "./BrandMark";

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
};

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { borderColor: theme.border, backgroundColor: theme.surface }]}>
      <BrandMark icon="sprout" size={62} />
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.textMuted }]}>{message}</Text>
      <AppButton label={actionLabel} icon="plus" onPress={onAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 22,
    alignItems: "center",
    gap: 12
  },
  title: {
    ...FONTS.h2,
    textAlign: "center"
  },
  message: {
    ...FONTS.body,
    textAlign: "center"
  }
});