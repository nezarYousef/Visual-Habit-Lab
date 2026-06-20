import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FONTS } from "../constants/typography";
import { VISUAL_TYPES, VisualType } from "../constants/visuals";
import { useTheme } from "../context/ThemeContext";

type VisualSelectorProps = {
  value: VisualType;
  onChange: (value: VisualType) => void;
};

export function VisualSelector({ value, onChange }: VisualSelectorProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.grid}>
      {(Object.keys(VISUAL_TYPES) as VisualType[]).map((visualType) => {
        const visual = VISUAL_TYPES[visualType];
        const selected = visualType === value;

        return (
          <Pressable
            key={visualType}
            accessibilityRole="button"
            onPress={() => onChange(visualType)}
            style={[
              styles.option,
              {
                backgroundColor: selected ? theme.surfaceMuted : theme.surface,
                borderColor: selected ? theme.primary : theme.border
              }
            ]}
          >
            <MaterialCommunityIcons name={visual.icon} size={26} color={visual.colors[1]} />
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: theme.text }]}>{visual.label}</Text>
              {selected ? <MaterialCommunityIcons name="check-circle" size={16} color={theme.primary} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  option: {
    width: "48%",
    minHeight: 82,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  label: {
    ...FONTS.small
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  }
});
