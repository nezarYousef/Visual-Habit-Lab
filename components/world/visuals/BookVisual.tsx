import Svg, { Circle, Defs, Ellipse, Line, LinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";
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
        <Defs>
          <RadialGradient id="bookShadowShelf" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#0F2A24" stopOpacity="0.38" />
            <Stop offset="1" stopColor="#0F2A24" stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id="woodGrain" x1="28" y1="51" x2="112" y2="116" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={warning ? "#B68240" : "#92694A"} />
            <Stop offset="1" stopColor={wood} />
          </LinearGradient>
        </Defs>
        <Ellipse cx="70" cy="124" rx={48 + level * 4} ry="13" fill="url(#bookShadowShelf)" />
        <Rect x="28" y="51" width="84" height="65" rx="7" fill="url(#woodGrain)" />
        <Rect x="30" y="53" width="80" height="4" rx="2" fill="#FFFFFF" opacity="0.16" />
        <Rect x="35" y="59" width="70" height="7" rx="3" fill="#C8945A" />
        <Rect x="35" y="88" width="70" height="7" rx="3" fill="#C8945A" />
        {Array.from({ length: Math.min(8, level + 4) }).map((_, index) => (
          <Rect key={index} x={39 + index * 8} y={68 + (index % 2) * 2} width="6" height={18 + (index % 3) * 3} rx="2" fill={index % 2 ? accent : "#F07067"} />
        ))}
        {level >= 4 ? <Circle cx="101" cy="50" r="6" fill="#FFE08A" /> : null}
      </Svg>
    );
  }

  const deep = warning ? "#935A24" : "#A33B5D";

  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      <Defs>
        <RadialGradient id="bookShadow" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#0F2A24" stopOpacity="0.38" />
          <Stop offset="1" stopColor="#0F2A24" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="bookCover" x1="32" y1="48" x2="70" y2="112" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={warning ? "#F0C879" : "#FF9285"} />
          <Stop offset="1" stopColor={warning ? "#D7A33D" : "#F07067"} />
        </LinearGradient>
      </Defs>
      <Ellipse cx="70" cy="124" rx={48 + level * 4} ry="13" fill="url(#bookShadow)" />
      <Path d="M32 56 C48 48 59 51 70 62 L70 112 C58 102 47 100 32 107 Z" fill="url(#bookCover)" />
      <Path d="M108 56 C92 48 81 51 70 62 L70 112 C82 102 93 100 108 107 Z" fill={deep} />
      <Path d="M70 62 L70 112" stroke="#FFF8E9" strokeWidth="4" opacity="0.9" />
      <Path d="M34 60 C45 55 55 57 64 65" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" fill="none" />
      {Array.from({ length: level + 2 }).map((_, index) => (
        <Line key={index} x1="43" y1={69 + index * 8} x2="62" y2={73 + index * 7} stroke="#FFF8E9" strokeWidth="2.5" opacity="0.76" />
      ))}
      {level >= 4 ? <Circle cx="70" cy="48" r="7" fill="#FFE08A" /> : null}
    </Svg>
  );
}