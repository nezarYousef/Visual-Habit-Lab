import { DimensionValue, StyleSheet, Text, View } from "react-native";
import { FONTS } from "../constants/typography";
import { useTheme } from "../context/ThemeContext";

type BreakdownRowProps = {
  label: string;
  value: number;
  total: number;
  color?: string;
};

export function BreakdownRow({ label, value, total, color }: BreakdownRowProps) {
  const { theme } = useTheme();
  const width = `${total > 0 ? Math.max(6, Math.round((value / total) * 100)) : 0}%` as DimensionValue;

  return (
    <View style={styles.row}>
      <View style={styles.topLine}>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        <Text style={[styles.value, { color: theme.textMuted }]}>{value}</Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.border }]}>
        <View style={[styles.fill, { width, backgroundColor: color ?? theme.primary }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 7
  },
  topLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  label: {
    ...FONTS.small,
    flex: 1
  },
  value: {
    ...FONTS.small
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    borderRadius: 4
  }
});
