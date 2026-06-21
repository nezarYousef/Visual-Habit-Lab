import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";
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
      <Ellipse cx="70" cy="122" rx={45 + level * 3} ry="10" fill="#17382E" opacity="0.2" />
      <Ellipse cx="70" cy="115" rx="48" ry="15" fill={deep} opacity="0.9" />
      <Rect x="27" y="101" width="86" height="16" rx="8" fill="#8FC7DF" />
      <Ellipse cx="70" cy="101" rx="42" ry="12" fill={water} />
      <Rect x="58" y="72" width="24" height="34" rx="9" fill={deep} />
      <Path d={`M70 75 C53 ${65 - level * 4} 44 ${61 - level * 8} 38 ${51 - level * 8}`} stroke={water} strokeWidth="6" strokeLinecap="round" fill="none" />
      <Path d={`M70 75 C87 ${65 - level * 4} 96 ${61 - level * 8} 102 ${51 - level * 8}`} stroke={water} strokeWidth="6" strokeLinecap="round" fill="none" />
      {level >= 3 ? <Path d="M70 72 C67 56 68 42 70 29" stroke={water} strokeWidth="6" strokeLinecap="round" fill="none" /> : null}
      {level >= 4 ? <Circle cx="70" cy="27" r="7" fill="#FFE08A" /> : null}
    </Svg>
  );
}
