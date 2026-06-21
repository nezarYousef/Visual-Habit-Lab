import { memo, useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";
import Svg, { Ellipse } from "react-native-svg";

export const CloudLayer = memo(function CloudLayer() {
  return (
    <>
      <Cloud delay={0} top={22} scale={1.05} opacity={0.5} />
      <Cloud delay={1100} top={82} scale={0.74} opacity={0.38} reverse />
      <Cloud delay={2100} top={142} scale={0.54} opacity={0.28} />
    </>
  );
});

function Cloud({
  delay,
  top,
  scale,
  opacity,
  reverse = false
}: {
  delay: number;
  top: number;
  scale: number;
  opacity: number;
  reverse?: boolean;
}) {
  const progress = useSharedValue(reverse ? 1 : 0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(reverse ? 0 : 1, { duration: 32000, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
  }, [delay, progress, reverse]);

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], reverse ? [54, -42] : [-48, 60])
      },
      { scale }
    ]
  }));

  return (
    <Animated.View style={[styles.cloud, { top, opacity }, style]}>
      <Svg width="126" height="48" viewBox="0 0 126 48">
        <Ellipse cx="34" cy="29" rx="28" ry="14" fill="#FFFFFF" opacity="0.72" />
        <Ellipse cx="65" cy="23" rx="36" ry="18" fill="#FFFFFF" opacity="0.76" />
        <Ellipse cx="96" cy="30" rx="25" ry="13" fill="#FFFFFF" opacity="0.68" />
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
