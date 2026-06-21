import Svg, { Circle, Ellipse, G, Line, Path, Rect } from "react-native-svg";
import { HabitLevel, HabitStatus } from "../../../features/habits/habit.types";

type BookVisualProps = {
  level: HabitLevel;
  status: HabitStatus;
  size: number;
  variant?: "book" | "shelf";
};

export function BookVisual({ level, status, size, variant = "book" }: BookVisualProps) {
  const warning = status === "at_risk";

  if (variant === "shelf") {
    const wood = warning ? "#9A6A2E" : "#7C5336";
    const accent = warning ? "#D7A33D" : "#5DA9E9";

    return (
      <Svg width={size} height={size} viewBox="0 0 140 140">
        <Ellipse cx="70" cy="122" rx={42 + level * 3} ry="10" fill="#17382E" opacity="0.2" />
        <Rect x="28" y="51" width="84" height="65" rx="7" fill={wood} />
        <Rect x="35" y="59" width="70" height="7" rx="3" fill="#C8945A" />
        <Rect x="35" y="88" width="70" height="7" rx="3" fill="#C8945A" />
        {Array.from({ length: Math.min(8, level + 4) }).map((_, index) => (
          <Rect key={index} x={39 + index * 8} y={68 + (index % 2) * 2} width="6" height={18 + (index % 3) * 3} rx="2" fill={index % 2 ? accent : "#F07067"} />
        ))}
        {level >= 4 ? <Circle cx="101" cy="50" r="6" fill="#FFE08A" /> : null}
      </Svg>
    );
  }

  const cover = warning ? "#D7A33D" : "#F07067";
  const deep = warning ? "#935A24" : "#A33B5D";

  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      <Ellipse cx="70" cy="122" rx={42 + level * 3} ry="10" fill="#17382E" opacity="0.2" />
      <Path d="M32 56 C48 48 59 51 70 62 L70 112 C58 102 47 100 32 107 Z" fill={cover} />
      <Path d="M108 56 C92 48 81 51 70 62 L70 112 C82 102 93 100 108 107 Z" fill={deep} />
      <Path d="M70 62 L70 112" stroke="#FFF8E9" strokeWidth="4" opacity="0.9" />
      {Array.from({ length: level + 2 }).map((_, index) => (
        <Line key={index} x1="43" y1={69 + index * 8} x2="62" y2={73 + index * 7} stroke="#FFF8E9" strokeWidth="2.5" opacity="0.76" />
      ))}
      {level >= 4 ? <Circle cx="70" cy="48" r="7" fill="#FFE08A" /> : null}
    </Svg>
  );
}
