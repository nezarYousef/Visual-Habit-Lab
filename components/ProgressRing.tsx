import Svg, { Circle } from "react-native-svg";
import { StyleSheet, Text, View } from "react-native";
import { FONTS } from "../constants/typography";
import { useTheme } from "../context/ThemeContext";

type ProgressRingProps = {
  value: number;
  size?: number;
};

export function ProgressRing({ value, size = 120 }: ProgressRingProps) {
  const { theme } = useTheme();
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={theme.border} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.primary}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.value, { color: theme.text }]}>{value}%</Text>
        <Text style={[styles.label, { color: theme.textMuted }]}>weekly</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center"
  },
  value: {
    ...FONTS.h2
  },
  label: {
    ...FONTS.small
  }
});
