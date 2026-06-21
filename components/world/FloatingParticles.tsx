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
        <Particle key={`${particle.left}-${particle.top}`} {...particle} delay={index * 330} />
      ))}
      {hasFountain ? <WaterRipple /> : null}
    </View>
  );
});

function Particle({ left, top, size, delay }: { left: number; top: number; size: number; delay: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 2800 + delay, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
  }, [delay, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.55, 1], [0.18, 0.9, 0.24]),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -14]) }, { scale: interpolate(progress.value, [0, 1], [0.86, 1.18]) }]
  }));

  return (
    <View style={[styles.particleSlot, { left: `${left}%` as `${number}%`, top, width: size, height: size }]}>
      <Animated.View style={[styles.particle, { borderRadius: size / 2 }, style]} />
    </View>
  );
}

function WaterRipple() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1900, easing: Easing.out(Easing.quad) }), -1, false);
  }, [progress]);

  const first = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.75, 1], [0.38, 0.16, 0]),
    transform: [{ scaleX: interpolate(progress.value, [0, 1], [0.28, 1]) }, { scaleY: interpolate(progress.value, [0, 1], [0.4, 1]) }]
  }));

  const second = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6, 1], [0, 0.24, 0]),
    transform: [{ scaleX: interpolate(progress.value, [0, 1], [0.16, 0.78]) }, { scaleY: interpolate(progress.value, [0, 1], [0.25, 0.72]) }]
  }));

  return (
    <View style={styles.rippleAnchor}>
      <Animated.View style={[styles.ripple, first]} />
      <Animated.View style={[styles.ripple, second]} />
    </View>
  );
}

const PARTICLES = [
  { left: 13, top: 116, size: 4 },
  { left: 28, top: 64, size: 3 },
  { left: 48, top: 98, size: 5 },
  { left: 66, top: 48, size: 3 },
  { left: 82, top: 132, size: 4 },
  { left: 91, top: 84, size: 3 },
  { left: 38, top: 148, size: 3 },
  { left: 73, top: 178, size: 4 }
] as const;

const styles = StyleSheet.create({
  particleSlot: {
    position: "absolute"
  },
  particle: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFF1A8"
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
  }
});
