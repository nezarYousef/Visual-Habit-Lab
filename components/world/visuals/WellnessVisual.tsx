import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";
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
        <Ellipse cx="70" cy="122" rx={42 + level * 3} ry="10" fill="#17382E" opacity="0.18" />
        <Circle cx="72" cy={66 - level * 6} r={22 + level * 3} fill={moon} />
        <Circle cx="84" cy={58 - level * 6} r={20 + level * 2} fill="#5A6D8A" opacity="0.75" />
        <Ellipse cx="61" cy="102" rx="30" ry="14" fill={cloud} />
        <Ellipse cx="82" cy="101" rx="26" ry="13" fill={cloud} opacity="0.9" />
        {level >= 4 ? <Circle cx="45" cy="52" r="5" fill="#FFE08A" /> : null}
        {level >= 3 ? <Circle cx="101" cy="42" r="3" fill="#FFF8E9" /> : null}
      </Svg>
    );
  }

  const wall = warning ? "#D7A33D" : "#F4D3A5";
  const roof = warning ? "#9A6A2E" : "#A8504F";
  const light = level >= 4 ? "#FFE08A" : "#8BD3F7";

  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      <Ellipse cx="70" cy="122" rx={42 + level * 3} ry="10" fill="#17382E" opacity="0.18" />
      <Rect x="42" y={75 - level * 4} width="56" height={42 + level * 4} rx="8" fill={wall} />
      <Path d={`M35 ${78 - level * 4} L70 ${47 - level * 6} L105 ${78 - level * 4} Z`} fill={roof} />
      <Rect x="62" y="94" width="16" height="24" rx="5" fill="#7C5336" />
      <Circle cx="84" cy="88" r="7" fill={light} opacity="0.9" />
      {level >= 3 ? <Circle cx="56" cy="88" r="7" fill={light} opacity="0.78" /> : null}
      {level >= 4 ? <Circle cx="70" cy="42" r="6" fill="#FFE08A" /> : null}
    </Svg>
  );
}
