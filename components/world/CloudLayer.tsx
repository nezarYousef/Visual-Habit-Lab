import { memo, useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";
import Svg, { Ellipse } from "react-native-svg";

export const CloudLayer = memo(function CloudLayer() {
  return (
    <>
      <Cloud delay={0} top={18} scale={1.08} opacity={0.52} driftDuration={30000} bobDuration={8200} />
      <Cloud delay={1100} top={80} scale={0.76} opacity={0.4} reverse driftDuration={36000} bobDuration={9600} />
      <Cloud delay={2100} top={140} scale={0.56} opacity={0.3} driftDuration={42000} bobDuration={11400} />
      <Cloud delay={2900} top={198} scale={0.4} opacity={0.2} reverse driftDuration={48000} bobDuration={13200} />
    </>
  );
});

function Cloud({
  delay,
  top,
  scale,
  opacity,
  reverse = false,
  driftDuration = 32000,
  bobDuration = 9000
}: {
  delay: number;
  top: number;
  scale: number;
  opacity: number;
  reverse?: boolean;
  driftDuration?: number;
  bobDuration?: number;
}) {
  const progress = useSharedValue(reverse ? 1 : 0);
  const bob = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(reverse ? 0 : 1, { duration: driftDuration, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
    bob.value = withDelay(delay, withRepeat(withTiming(1, { duration: bobDuration, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, [bob, bobDuration, delay, driftDuration, progress, reverse]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], reverse ? [54, -42] : [-48, 60]) },
      { translateY: interpolate(bob.value, [0, 1], [-4, 4]) },
      { scale: scale * (1 + bob.value * 0.025) }
    ]
  }));

  return (
    <Animated.View style={[styles.cloud, { top, opacity }, style]}>
      <Svg width="126" height="48" viewBox="0 0 126 48">
        <Ellipse cx="34" cy="32" rx="26" ry="11" fill="#FFFFFF" opacity="0.4" />
        <Ellipse cx="34" cy="29" rx="28" ry="14" fill="#FFFFFF" opacity="0.72" />
        <Ellipse cx="65" cy="23" rx="36" ry="18" fill="#FFFFFF" opacity="0.78" />
        <Ellipse cx="96" cy="30" rx="25" ry="13" fill="#FFFFFF" opacity="0.7" />
        <Ellipse cx="65" cy="34" rx="40" ry="10" fill="#FFFFFF" opacity="0.32" />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cloud: {
    position: "absolute",
    left: "-10%"
  }
});