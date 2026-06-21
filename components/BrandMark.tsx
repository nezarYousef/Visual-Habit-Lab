import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

type BrandMarkProps = {
  icon: IconName;
  size?: number;
  animated?: boolean;
};

/**
 * Shared "brand mark": a gradient circle with a soft pulsing glow behind an icon.
 * Used anywhere the app needs a premium, on-brand focal point (onboarding hero,
 * empty states, and future loading/success moments) instead of a flat icon circle.
 */
export function BrandMark({ icon, size = 96, animated = true }: BrandMarkProps) {
  const { theme, themeName } = useTheme();
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (!animated) return undefined;

    pulse.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }), -1, true);
    return undefined;
  }, [animated, pulse]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.3 + pulse.value * 0.22,
    transform: [{ scale: 1 + pulse.value * 0.08 }]
  }));

  const gradientColors = (themeName === "dark" ? [theme.surfaceMuted, theme.surface] : [theme.surfaceMuted, theme.background]) as [
    string,
    string
  ];
  const wrapSize = size * 1.5;

  return (
    <Animated.View style={[styles.wrap, { width: wrapSize, height: wrapSize }]}>
      <Animated.View
        style={[styles.glow, { width: wrapSize, height: wrapSize, borderRadius: wrapSize / 2, backgroundColor: theme.primary }, glowStyle]}
      />
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.mark, { width: size, height: size, borderRadius: size / 2, borderColor: theme.border }]}
      >
        <MaterialCommunityIcons name={icon} size={size * 0.46} color={theme.primary} />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center"
  },
  glow: {
    position: "absolute"
  },
  mark: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1
  }
});