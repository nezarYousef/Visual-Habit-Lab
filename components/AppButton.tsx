import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { FONTS } from "../constants/typography";
import { useTheme } from "../context/ThemeContext";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

type AppButtonProps = {
  label: string;
  icon: IconName;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  style?: ViewStyle;
  disabled?: boolean;
};

export function AppButton({ label, icon, onPress, variant = "primary", style, disabled }: AppButtonProps) {
  const { theme } = useTheme();
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";
  const backgroundColor = isPrimary ? theme.primary : isDanger ? theme.danger : "transparent";
  const borderColor = variant === "ghost" ? "transparent" : isPrimary || isDanger ? backgroundColor : theme.border;
  const color = isPrimary || isDanger ? theme.surface : theme.text;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor,
          opacity: disabled ? 0.45 : pressed ? 0.78 : 1
        },
        style
      ]}
    >
      <MaterialCommunityIcons name={icon} size={20} color={color} />
      <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.label, { color }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16
  },
  label: {
    ...FONTS.button
  }
});
