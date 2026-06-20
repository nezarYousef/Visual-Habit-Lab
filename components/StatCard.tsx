import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { FONTS } from "../constants/typography";
import { useTheme } from "../context/ThemeContext";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

type StatCardProps = {
  label: string;
  value: string;
  icon: IconName;
};

export function StatCard({ label, value, icon }: StatCardProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <MaterialCommunityIcons name={icon} size={23} color={theme.primary} />
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      <Text numberOfLines={2} style={[styles.label, { color: theme.textMuted }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 145,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    gap: 6
  },
  value: {
    ...FONTS.h2
  },
  label: {
    ...FONTS.small
  }
});
