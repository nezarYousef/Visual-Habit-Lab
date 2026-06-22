import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { HabitLevel, HabitStatus } from "../../../features/habits/habit.types";

type WellnessVisualProps = {
  level: HabitLevel;
  status: HabitStatus;
  size: number;
  variant?: "house" | "moon";
};

export function WellnessVisual({ level, status, size, variant = "house" }: WellnessVisualProps) {
  const warning = status === "at_risk";

  if (variant === "moon") {
    const moon = warning ? "#D7A33D" : "#FFF1A8";
    const cloud = warning ? "#B89160" : "#DDEEFF";

    return (
      <Svg width={size} height={size} viewBox="0 0 140 140">
        <Defs>
          <RadialGradient id="wellnessShadowMoon" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#0F2237" stopOpacity="0.38" />
            <Stop offset="1" stopColor="#0F2237" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="moonGlow" cx="0.36" cy="0.32" r="0.75">
            <Stop offset="0" stopColor="#FFFDF0" />
            <Stop offset="0.6" stopColor={moon} />
            <Stop offset="1" stopColor={warning ? "#9A6A2E" : "#E8C36B"} />
          </RadialGradient>
        </Defs>
        <Ellipse cx="70" cy="124" rx={48 + level * 4} ry="13" fill="url(#wellnessShadowMoon)" />
        <Circle cx="72" cy={66 - level * 6} r={22 + level * 3} fill="url(#moonGlow)" />
        <Circle cx="84" cy={58 - level * 6} r={20 + level * 2} fill="#5A6D8A" opacity="0.75" />
        <Ellipse cx="61" cy="102" rx="30" ry="14" fill={cloud} />
        <Ellipse cx="82" cy="101" rx="26" ry="13" fill={cloud} opacity="0.9" />
        {level >= 4 ? <Circle cx="45" cy="52" r="5" fill="#FFE08A" /> : null}
        {level >= 3 ? <Circle cx="101" cy="42" r="3" fill="#FFF8E9" /> : null}
      </Svg>
    );
  }

  const roof = warning ? "#9A6A2E" : "#A8504F";
  const light = level >= 4 ? "#FFE08A" : "#8BD3F7";

  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      <Defs>
        <RadialGradient id="wellnessShadowHouse" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#0F2237" stopOpacity="0.38" />
          <Stop offset="1" stopColor="#0F2237" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="houseWall" x1="42" y1={75 - level * 4} x2="98" y2="118" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={warning ? "#F0C879" : "#FFE6BD"} />
          <Stop offset="1" stopColor={warning ? "#D7A33D" : "#F4D3A5"} />
        </LinearGradient>
        <RadialGradient id="windowGlow" cx="0.5" cy="0.5" r="0.6">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor={light} />
        </RadialGradient>
      </Defs>
      <Ellipse cx="70" cy="124" rx={48 + level * 4} ry="13" fill="url(#wellnessShadowHouse)" />
      <Rect x="42" y={75 - level * 4} width="56" height={42 + level * 4} rx="8" fill="url(#houseWall)" />
      <Path d={`M35 ${78 - level * 4} L70 ${47 - level * 6} L105 ${78 - level * 4} Z`} fill={roof} />
      <Path d={`M35 ${78 - level * 4} L70 ${47 - level * 6}`} stroke="#FFFFFF" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      <Rect x="62" y="94" width="16" height="24" rx="5" fill="#7C5336" />
      <Circle cx="84" cy="88" r="7" fill="url(#windowGlow)" opacity="0.92" />
      {level >= 3 ? <Circle cx="56" cy="88" r="7" fill="url(#windowGlow)" opacity="0.8" /> : null}
      {level >= 4 ? <Circle cx="70" cy="42" r="6" fill="#FFE08A" /> : null}
    </Svg>
  );
}