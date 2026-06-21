import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";
import { HabitLevel, HabitStatus } from "../../../features/habits/habit.types";

type TreeVisualProps = {
  level: HabitLevel;
  status: HabitStatus;
  size: number;
  variant?: "tree" | "plant";
};

export function TreeVisual({ level, status, size, variant = "tree" }: TreeVisualProps) {
  const warning = status === "at_risk";
  const leaf = warning ? "#D7A33D" : "#4EB46D";
  const deep = warning ? "#9A6A2E" : "#1D7752";
  const trunk = "#8B5A35";

  if (variant === "plant") {
    return (
      <Svg width={size} height={size} viewBox="0 0 140 140">
        <Ellipse cx="70" cy="122" rx={42 + level * 3} ry="10" fill="#17382E" opacity="0.22" />
        <Path d="M43 116 C48 98 57 85 70 75 C84 88 92 101 97 116 Z" fill="#8F633D" opacity="0.95" />
        <Path d="M70 111 C69 91 70 73 71 55" stroke={deep} strokeWidth="6" strokeLinecap="round" />
        <Ellipse cx="55" cy={91 - level * 6} rx={15 + level * 2} ry="9" fill={leaf} rotation="-35" origin={`55,${91 - level * 6}`} />
        <Ellipse cx="85" cy={86 - level * 7} rx={16 + level * 2} ry="9" fill={deep} rotation="32" origin={`85,${86 - level * 7}`} />
        {level >= 2 ? <Ellipse cx="62" cy={74 - level * 5} rx="14" ry="8" fill={leaf} rotation="-24" origin={`62,${74 - level * 5}`} /> : null}
        {level >= 3 ? <Circle cx="71" cy={52 - level * 4} r={9 + level} fill={level >= 4 ? "#FFE08A" : "#F38C7F"} /> : null}
      </Svg>
    );
  }

  const crown = 15 + level * 4;
  const trunkTop = 92 - level * 10;

  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      <Ellipse cx="70" cy="122" rx={42 + level * 3} ry="10" fill="#17382E" opacity="0.22" />
      {level === 1 ? (
        <G>
          <Path d="M70 116 C69 103 70 93 72 84" stroke={trunk} strokeWidth="8" strokeLinecap="round" />
          <Ellipse cx="61" cy="84" rx="18" ry="10" fill={leaf} rotation="-28" origin="61,84" />
          <Ellipse cx="80" cy="79" rx="19" ry="10" fill={deep} rotation="24" origin="80,79" />
        </G>
      ) : (
        <G>
          <Rect x="62" y={trunkTop} width="16" height={118 - trunkTop} rx="8" fill={trunk} />
          <Path d={`M70 ${trunkTop + 18} C55 ${trunkTop + 8} 48 ${trunkTop - 4} 44 ${trunkTop - 16}`} stroke={trunk} strokeWidth="6" strokeLinecap="round" fill="none" />
          <Path d={`M73 ${trunkTop + 16} C88 ${trunkTop + 8} 95 ${trunkTop - 6} 99 ${trunkTop - 20}`} stroke={trunk} strokeWidth="6" strokeLinecap="round" fill="none" />
          <Circle cx="44" cy={trunkTop - 17} r={crown} fill={leaf} />
          <Circle cx="96" cy={trunkTop - 21} r={crown + 2} fill={deep} />
          <Circle cx="70" cy={trunkTop - 34} r={crown + 4} fill={leaf} />
          {level >= 4 ? <Circle cx="72" cy={trunkTop - 36} r="8" fill="#FFE08A" opacity="0.96" /> : null}
        </G>
      )}
    </Svg>
  );
}
