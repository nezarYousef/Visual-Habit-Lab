import { LinearGradient } from "expo-linear-gradient";
import { PropsWithChildren, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import Svg, { Circle, Defs, Ellipse, LinearGradient as SvgLinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";

type WorldBackgroundProps = PropsWithChildren<{
  dark?: boolean;
  height: number;
}>;

export function WorldBackground({ children, dark = false, height }: WorldBackgroundProps) {
  const breathe = useSharedValue(0);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    breathe.value = withRepeat(withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }), -1, true);
    shimmer.value = withRepeat(withTiming(1, { duration: 6600, easing: Easing.inOut(Easing.quad) }), -1, false);
  }, [breathe, shimmer]);

  const artStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -breathe.value * 2.4 }, { scale: 1 + breathe.value * 0.012 }]
  }));

  const shimmerStyle = useAnimatedStyle(() => {
    const fade = Math.max(0, Math.min(1, (Math.min(shimmer.value, 1 - shimmer.value) - 0.04) * 3.2));
    return {
      left: `${-45 + shimmer.value * 190}%` as `${number}%`,
      opacity: fade
    };
  });

  return (
    // Outer shell carries the elevation/shadow; the gradient card clips its own
    // contents with overflow:hidden, which would otherwise also clip the shadow.
    <View style={[styles.shell, { height }]}>
      <LinearGradient
        colors={dark ? ["#0B1A29", "#102A3A", "#15303D", "#172330"] : ["#BEE8FF", "#D6F1EA", "#EFF6DD", "#FFEAC6"]}
        locations={[0, 0.38, 0.68, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.world}
      >
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, artStyle]}>
          <Svg width="100%" height="100%" viewBox="0 0 360 430" preserveAspectRatio="none">
            <Defs>
              <SvgLinearGradient id="islandTop" x1="40" y1="176" x2="315" y2="381" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#C9EBB1" />
                <Stop offset="0.42" stopColor="#74C57A" />
                <Stop offset="1" stopColor="#3F8F63" />
              </SvgLinearGradient>
              <SvgLinearGradient id="islandSide" x1="40" y1="258" x2="324" y2="430" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#5A805A" />
                <Stop offset="0.5" stopColor="#315E4E" />
                <Stop offset="1" stopColor="#1B3537" />
              </SvgLinearGradient>
              <SvgLinearGradient id="water" x1="0" y1="170" x2="360" y2="410" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#8FD8EC" stopOpacity="0.6" />
                <Stop offset="1" stopColor="#2A6781" stopOpacity="0.36" />
              </SvgLinearGradient>
              <SvgLinearGradient id="path" x1="122" y1="214" x2="296" y2="405" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#FFF3CC" />
                <Stop offset="1" stopColor="#E0AD6E" />
              </SvgLinearGradient>
              <RadialGradient id="horizonGlow" cx="0.5" cy="0.4" r="0.55">
                <Stop offset="0" stopColor={dark ? "#3E6B86" : "#FFF6DC"} stopOpacity={dark ? 0.32 : 0.55} />
                <Stop offset="1" stopColor={dark ? "#3E6B86" : "#FFF6DC"} stopOpacity="0" />
              </RadialGradient>
              <RadialGradient id="sunCore" cx="0.5" cy="0.5" r="0.5">
                <Stop offset="0" stopColor="#FFF7DC" />
                <Stop offset="1" stopColor="#FFE9A8" stopOpacity="0.15" />
              </RadialGradient>
            </Defs>

            <Rect x="0" y="0" width="360" height="430" fill="url(#horizonGlow)" />

            {/* distant atmospheric ridge — gives the scene a third depth plane behind the island */}
            <Path
              d="M-30 232 C40 196 110 206 178 198 C252 190 300 210 392 178 L392 430 L-30 430 Z"
              fill={dark ? "#1B3344" : "#CFE8E0"}
              opacity={dark ? 0.4 : 0.4}
            />

            <Rect x="0" y="176" width="360" height="254" fill="url(#water)" opacity={dark ? 0.36 : 0.55} />
            <Path
              d="M-18 270 C45 226 94 230 139 258 C188 288 226 255 266 228 C306 201 337 217 382 185 L382 430 L-18 430 Z"
              fill="#D7F2FF"
              opacity={dark ? 0.05 : 0.22}
            />

            <Circle cx="305" cy="82" r="31" fill="url(#sunCore)" />
            <Circle cx="305" cy="82" r="52" fill="#FFF1A8" opacity={dark ? 0.08 : 0.14} />

            <Ellipse cx="183" cy="363" rx="152" ry="37" fill="#0D2622" opacity={dark ? 0.46 : 0.24} />
            <Path
              d="M30 288 C44 218 103 174 178 176 C250 178 316 210 332 277 C315 344 262 383 181 386 C98 389 48 355 30 288 Z"
              fill="url(#islandSide)"
              opacity="0.98"
            />
            <Path
              d="M31 264 C47 205 105 164 177 164 C247 164 309 197 330 255 C313 308 257 340 181 342 C104 344 48 315 31 264 Z"
              fill="url(#islandTop)"
            />
            {/* rim light tracing the lit upper ridge, simulating a single soft sun source */}
            <Path
              d="M31 264 C47 205 105 164 177 164 C247 164 309 197 330 255"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity={dark ? 0.14 : 0.32}
            />

            <Path
              d="M44 257 C82 210 126 198 172 222 C215 244 257 221 316 206 C326 220 331 236 331 254 C298 275 265 287 232 287 C185 288 153 263 117 263 C89 263 68 272 39 289 C34 278 32 270 31 264 Z"
              fill="#7FD08B"
              opacity="0.72"
            />
            <Path
              d="M35 277 C66 294 97 297 126 285 C155 273 177 275 205 294 C235 315 281 310 323 279 C311 316 257 340 181 342 C104 344 50 316 35 277 Z"
              fill="#3F9863"
              opacity="0.58"
            />
            <Path d="M154 343 C164 309 178 283 202 258 C230 229 259 210 300 185" stroke="url(#path)" strokeWidth="30" strokeLinecap="round" opacity="0.82" />
            <Path d="M45 252 C91 240 112 211 139 188 C167 164 205 167 236 191 C271 217 296 206 330 184" stroke="#ACDDF1" strokeWidth="30" strokeLinecap="round" opacity="0.48" />

            <Ellipse cx="76" cy="289" rx="55" ry="23" fill="#CCE8B8" opacity="0.52" />
            <Ellipse cx="266" cy="270" rx="64" ry="27" fill="#D8D2FF" opacity="0.48" />
            <Ellipse cx="210" cy="216" rx="50" ry="20" fill="#BCD7FA" opacity="0.25" />

            <Rect x="202" y="124" width="22" height="78" rx="5" fill="#5F83A6" opacity={dark ? 0.3 : 0.18} />
            <Rect x="232" y="104" width="30" height="99" rx="5" fill="#587B9D" opacity={dark ? 0.28 : 0.18} />
            <Rect x="266" y="134" width="22" height="68" rx="5" fill="#6A8FB8" opacity={dark ? 0.26 : 0.16} />
          </Svg>
        </Animated.View>

        {/* slow diagonal light sweep across the water for a premium "catching the light" moment */}
        <Animated.View pointerEvents="none" style={[styles.shimmer, shimmerStyle]}>
          <LinearGradient
            colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.55)", "rgba(255,255,255,0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.shimmerBar}
          />
        </Animated.View>

        <LinearGradient pointerEvents="none" colors={["rgba(255,255,255,0.4)", "rgba(255,255,255,0)"]} style={styles.skySheen} />
        <LinearGradient pointerEvents="none" colors={["rgba(10,31,38,0)", "rgba(10,31,38,0.26)"]} style={styles.bottomShade} />
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: 8,
    shadowColor: "#0B1F23",
    shadowOpacity: 0.28,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 9
  },
  world: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)"
  },
  shimmer: {
    position: "absolute",
    top: "44%",
    bottom: 0,
    width: "26%"
  },
  shimmerBar: {
    flex: 1,
    transform: [{ rotate: "-16deg" }]
  },
  skySheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "34%"
  },
  bottomShade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "32%"
  }
});