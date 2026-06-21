import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { FONTS } from "../../constants/typography";
import { HabitWorldZone, HabitWorldZoneKey } from "../../features/habits/habitVisuals";

type CategoryZoneProps = {
  zone: HabitWorldZone;
  count: number;
  mode?: "label" | "chip";
  active?: boolean;
};

export function CategoryZone({ zone, count, mode = "label", active = true }: CategoryZoneProps) {
  if (mode === "chip") {
    return (
      <View style={[styles.chip, { borderColor: zone.color }]}>
        <MaterialCommunityIcons name={zone.icon} size={18} color={zone.color} />
        <Text numberOfLines={1} style={styles.chipText}>
          {zone.title}
        </Text>
        <Text style={[styles.count, { color: zone.color }]}>{count}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.label, getZoneLabelStyle(zone.key), { opacity: active ? 1 : 0.62 }]}>
      <MaterialCommunityIcons name={zone.icon} size={14} color={zone.color} />
      <Text style={[styles.labelText, { color: zone.color }]}>{zone.title}</Text>
    </View>
  );
}

function getZoneLabelStyle(zone: HabitWorldZoneKey) {
  if (zone === "garden") return styles.gardenLabel;
  if (zone === "library") return styles.libraryLabel;
  if (zone === "productivity") return styles.productivityLabel;
  return styles.wellnessLabel;
}

const styles = StyleSheet.create({
  label: {
    position: "absolute",
    zIndex: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.36)",
    backgroundColor: "rgba(255, 248, 233, 0.58)"
  },
  labelText: {
    ...FONTS.small,
    fontSize: 11,
    lineHeight: 14
  },
  gardenLabel: {
    left: 18,
    bottom: 132
  },
  libraryLabel: {
    right: 20,
    bottom: 154
  },
  productivityLabel: {
    left: "42%",
    top: 106
  },
  wellnessLabel: {
    right: 22,
    top: 82
  },
  chip: {
    minWidth: "47%",
    flexGrow: 1,
    minHeight: 40,
    borderRadius: 999,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.52)"
  },
  chipText: {
    ...FONTS.small,
    flex: 1,
    color: "#17382E"
  },
  count: {
    ...FONTS.h3
  }
});
