import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { HabitLevel, HabitStatus } from "../../../features/habits/habit.types";

type FountainVisualProps = {
  level: HabitLevel;
  status: HabitStatus;
  size: number;
};

export function FountainVisual({ level, status, size }: FountainVisualProps) {
  const warning = status === "at_risk";
  const water = warning ? "#D7A33D" : "#57BDEB";
  const deep = warning ? "#9A6A2E" : "#1769A8";

  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      <Defs>
        <RadialGradient id="fountainShadow" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#0F2A24" stopOpacity="0.4" />
          <Stop offset="1" stopColor="#0F2A24" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="basinWater" cx="0.42" cy="0.36" r="0.7">
          <Stop offset="0" stopColor={warning ? "#F2D08F" : "#BFEBFF"} />
          <Stop offset="0.6" stopColor={water} />
          <Stop offset="1" stopColor={deep} />
        </RadialGradient>
        <LinearGradient id="fountainPedestal" x1="58" y1="72" x2="82" y2="106" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={warning ? "#C2924E" : "#3D8DC4"} />
          <Stop offset="1" stopColor={deep} />
        </LinearGradient>
      </Defs>

      <Ellipse cx="70" cy="124" rx={50 + level * 4} ry="13" fill="url(#fountainShadow)" />
      <Ellipse cx="70" cy="115" rx="48" ry="15" fill={deep} opacity="0.9" />
      <Rect x="27" y="101" width="86" height="16" rx="8" fill="#8FC7DF" />
      <Ellipse cx="70" cy="101" rx="42" ry="12" fill="url(#basinWater)" />
      <Ellipse cx="58" cy="97" rx="13" ry="4" fill="#FFFFFF" opacity="0.4" />
      <Rect x="58" y="72" width="24" height="34" rx="9" fill="url(#fountainPedestal)" />
      <Rect x="60" y="73" width="5" height="32" rx="2.5" fill="#FFFFFF" opacity="0.18" />
      <Path d={`M70 75 C53 ${65 - level * 4} 44 ${61 - level * 8} 38 ${51 - level * 8}`} stroke={water} strokeWidth="6" strokeLinecap="round" fill="none" />
      <Path d={`M70 75 C87 ${65 - level * 4} 96 ${61 - level * 8} 102 ${51 - level * 8}`} stroke={water} strokeWidth="6" strokeLinecap="round" fill="none" />
      {level >= 3 ? <Path d="M70 72 C67 56 68 42 70 29" stroke={water} strokeWidth="6" strokeLinecap="round" fill="none" /> : null}
      {level >= 4 ? <Circle cx="70" cy="27" r="7" fill="#FFE08A" /> : null}
    </Svg>
  );
}