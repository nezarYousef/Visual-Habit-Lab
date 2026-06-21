import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppButton({ label, icon, onPress, variant = "primary", style, disabled }: AppButtonProps) {
  const { theme } = useTheme();
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";
  const isGhost = variant === "ghost";
  const backgroundColor = isPrimary ? theme.primary : isDanger ? theme.danger : "transparent";
  const borderColor = isGhost ? "transparent" : isPrimary || isDanger ? backgroundColor : theme.border;
  const color = isPrimary || isDanger ? theme.surface : theme.text;
  const press = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: press.value }]
  }));

  function handlePressIn() {
    if (disabled) return;
    press.value = withSpring(0.96, { damping: 16, stiffness: 220 });
  }

  function handlePressOut() {
    press.value = withSpring(1, { damping: 14, stiffness: 200 });
  }

  function handlePress() {
    if (!isGhost) {
      Haptics.selectionAsync().catch(() => undefined);
    }
    onPress();
  }

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor,
          opacity: disabled ? 0.45 : 1,
          shadowOpacity: isPrimary || isDanger ? 0.16 : 0,
          elevation: isPrimary || isDanger ? 3 : 0
        },
        pressStyle,
        style
      ]}
    >
      <MaterialCommunityIcons name={icon} size={20} color={color} />
      <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.label, { color }]}>
        {label}
      </Text>
    </AnimatedPressable>
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
    paddingHorizontal: 16,
    shadowColor: "#102A2B",
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 }
  },
  label: {
    ...FONTS.button
  }
});