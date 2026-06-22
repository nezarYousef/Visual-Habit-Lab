import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { FONTS } from "../../constants/typography";
import { HabitWorldZone, HabitWorldZoneKey } from "../../features/habits/habitVisuals";

type CategoryZoneProps = {
  zone: HabitWorldZone;
  count: number;
  completed?: number;
  mode?: "label" | "chip";
  active?: boolean;
};

export function CategoryZone({ zone, count, completed = 0, mode = "label", active = true }: CategoryZoneProps) {
  const ratio = count > 0 ? Math.min(1, completed / count) : 0;

  if (mode === "chip") {
    return (
      <View style={[styles.chip, { borderColor: `${zone.color}4D` }]}>
        <View style={[styles.chipIconWrap, { backgroundColor: `${zone.color}1F` }]}>
          <MaterialCommunityIcons name={zone.icon} size={16} color={zone.color} />
        </View>
        <View style={styles.chipBody}>
          <View style={styles.chipTopRow}>
            <Text numberOfLines={1} style={styles.chipText}>
              {zone.title}
            </Text>
            <Text style={[styles.count, { color: zone.color }]}>{count}</Text>
          </View>
          {count > 0 ? (
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${ratio * 100}%`, backgroundColor: zone.color }]} />
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.label, getZoneLabelStyle(zone.key), { opacity: active ? 1 : 0.55 }]}>
      <View style={[styles.labelDot, { backgroundColor: zone.color }]} />
      <MaterialCommunityIcons name={zone.icon} size={13} color={zone.color} />
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
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "rgba(255, 248, 233, 0.64)",
    shadowColor: "#102A2B",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  labelDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5
  },
  labelText: {
    ...FONTS.small,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700"
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
    minHeight: 54,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.6)"
  },
  chipIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  chipBody: {
    flex: 1,
    gap: 5
  },
  chipTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6
  },
  chipText: {
    ...FONTS.small,
    flex: 1,
    color: "#17382E",
    fontWeight: "600"
  },
  count: {
    ...FONTS.h3
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(23,56,46,0.1)",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 2
  }
});