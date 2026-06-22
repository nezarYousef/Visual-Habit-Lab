import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { FONTS } from "../../constants/typography";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressDockProps = {
  completed: number;
  total: number;
};

const SIZE = 46;
const STROKE = 5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressDock({ completed, total }: ProgressDockProps) {
  const progress = useSharedValue(0);
  const ratio = total > 0 ? Math.min(1, completed / total) : 0;

  useEffect(() => {
    progress.value = withTiming(ratio, { duration: 520, easing: Easing.out(Easing.cubic) });
  }, [progress, ratio]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE - progress.value * CIRCUMFERENCE
  }));

  return (
    <View style={styles.dock}>
      <View style={styles.ringWrap}>
        <Svg width={SIZE} height={SIZE}>
          <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke="rgba(255,255,255,0.22)" strokeWidth={STROKE} fill="none" />
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#FFE08A"
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            animatedProps={animatedProps}
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        <View style={styles.ringCenter}>
          <Text style={styles.ringValue}>{total > 0 ? Math.round(ratio * 100) : 0}%</Text>
        </View>
      </View>
      <View>
        <Text style={styles.dockValue}>
          {completed}/{total || 0}
        </Text>
        <Text style={styles.dockLabel}>complete today</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: "absolute",
    zIndex: 31,
    right: 14,
    bottom: 14,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(15, 38, 33, 0.8)",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#102A2B",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5
  },
  ringWrap: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center"
  },
  ringCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  ringValue: {
    ...FONTS.small,
    fontSize: 10,
    color: "#FFF8E9",
    fontWeight: "700"
  },
  dockValue: {
    ...FONTS.h3,
    color: "#FFF8E9"
  },
  dockLabel: {
    ...FONTS.small,
    color: "#CFEFFF",
    fontSize: 10,
    lineHeight: 13,
    textTransform: "uppercase"
  }
});