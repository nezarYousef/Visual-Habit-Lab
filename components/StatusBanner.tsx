import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { FONTS } from "../constants/typography";
import { useTheme } from "../context/ThemeContext";
import { AppButton } from "./AppButton";

type StatusBannerProps = {
  message: string;
  tone?: "info" | "danger";
  onDismiss?: () => void;
};

export function StatusBanner({ message, tone = "info", onDismiss }: StatusBannerProps) {
  const { theme } = useTheme();
  const color = tone === "danger" ? theme.danger : theme.primary;

  return (
    <View style={[styles.banner, { backgroundColor: theme.surface, borderColor: color }]}>
      <MaterialCommunityIcons name={tone === "danger" ? "alert-circle-outline" : "content-save-outline"} size={20} color={color} />
      <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
      {onDismiss ? <AppButton label="Dismiss" icon="close" variant="ghost" onPress={onDismiss} style={styles.dismiss} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14
  },
  message: {
    ...FONTS.small,
    flex: 1
  },
  dismiss: {
    minHeight: 34,
    paddingHorizontal: 8
  }
});
