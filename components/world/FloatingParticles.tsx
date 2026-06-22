import { memo, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";

type FloatingParticlesProps = {
  hasFountain?: boolean;
};

export const FloatingParticles = memo(function FloatingParticles({ hasFountain = false }: FloatingParticlesProps) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {PARTICLES.map((particle, index) => (
        <Particle key={`${particle.left}-${particle.top}`} {...particle} delay={index * 310} />
      ))}
      {hasFountain ? <WaterRipple /> : null}
    </View>
  );
});

function Particle({
  left,
  top,
  size,
  delay,
  tone
}: {
  left: number;
  top: number;
  size: number;
  delay: number;
  tone: "warm" | "cool";
}) {
  const progress = useSharedValue(0);
  const drift = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 3000 + delay, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
    drift.value = withDelay(
      delay + 400,
      withRepeat(withTiming(1, { duration: 4200 + delay, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
  }, [delay, drift, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0.16, tone === "warm" ? 0.92 : 0.7, 0.2]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -16]) },
      { translateX: interpolate(drift.value, [0, 1], [-3, 3]) },
      { scale: interpolate(progress.value, [0, 1], [0.84, 1.22]) }
    ]
  }));

  const color = tone === "warm" ? "#FFF1A8" : "#CDEFFF";

  return (
    <View style={[styles.particleSlot, { left: `${left}%` as `${number}%`, top, width: size, height: size }]}>
      <Animated.View style={[styles.particle, { borderRadius: size / 2, backgroundColor: color }, style]} />
    </View>
  );
}

function WaterRipple() {
  const progress = useSharedValue(0);
  const progressB = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.out(Easing.quad) }), -1, false);
    progressB.value = withDelay(650, withRepeat(withTiming(1, { duration: 2000, easing: Easing.out(Easing.quad) }), -1, false));
  }, [progress, progressB]);

  const first = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.75, 1], [0.4, 0.16, 0]),
    transform: [{ scaleX: interpolate(progress.value, [0, 1], [0.28, 1]) }, { scaleY: interpolate(progress.value, [0, 1], [0.4, 1]) }]
  }));

  const second = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6, 1], [0, 0.24, 0]),
    transform: [{ scaleX: interpolate(progress.value, [0, 1], [0.16, 0.78]) }, { scaleY: interpolate(progress.value, [0, 1], [0.25, 0.72]) }]
  }));

  const third = useAnimatedStyle(() => ({
    opacity: interpolate(progressB.value, [0, 0.7, 1], [0.3, 0.12, 0]),
    transform: [{ scaleX: interpolate(progressB.value, [0, 1], [0.2, 0.9]) }, { scaleY: interpolate(progressB.value, [0, 1], [0.3, 0.84]) }]
  }));

  return (
    <View style={styles.rippleAnchor}>
      <Animated.View style={[styles.ripple, first]} />
      <Animated.View style={[styles.ripple, second]} />
      <Animated.View style={[styles.ripple, styles.rippleAlt, third]} />
    </View>
  );
}

const PARTICLES: Array<{ left: number; top: number; size: number; tone: "warm" | "cool" }> = [
  { left: 13, top: 116, size: 4, tone: "warm" },
  { left: 28, top: 64, size: 3, tone: "cool" },
  { left: 48, top: 98, size: 5, tone: "warm" },
  { left: 66, top: 48, size: 3, tone: "cool" },
  { left: 82, top: 132, size: 4, tone: "warm" },
  { left: 91, top: 84, size: 3, tone: "warm" },
  { left: 38, top: 148, size: 3, tone: "cool" },
  { left: 73, top: 178, size: 4, tone: "warm" }
];

const styles = StyleSheet.create({
  particleSlot: {
    position: "absolute"
  },
  particle: {
    width: "100%",
    height: "100%"
  },
  rippleAnchor: {
    position: "absolute",
    left: "50%",
    bottom: 77,
    width: 128,
    height: 42,
    marginLeft: -64,
    alignItems: "center",
    justifyContent: "center"
  },
  ripple: {
    position: "absolute",
    width: 124,
    height: 38,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#BFF0FF"
  },
  rippleAlt: {
    borderColor: "#E7FBFF"
  }
});