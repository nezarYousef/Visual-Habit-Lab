import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { FONTS } from "../constants/typography";
import { useTheme } from "../context/ThemeContext";

export function LoadingState() {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.primary} />
      <Text style={[styles.text, { color: theme.textMuted }]}>Preparing your lab</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12
  },
  text: {
    ...FONTS.small
  }
});
