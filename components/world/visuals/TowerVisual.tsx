import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { HabitLevel, HabitStatus } from "../../../features/habits/habit.types";

type TowerVisualProps = {
  level: HabitLevel;
  status: HabitStatus;
  size: number;
  variant?: "tower" | "desk";
};

export function TowerVisual({ level, status, size, variant = "tower" }: TowerVisualProps) {
  const warning = status === "at_risk";

  if (variant === "desk") {
    const wood = warning ? "#A15C22" : "#8B5A35";
    const screen = warning ? "#D7A33D" : "#465A69";

    return (
      <Svg width={size} height={size} viewBox="0 0 140 140">
        <Defs>
          <RadialGradient id="towerShadowDesk" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#0F2A24" stopOpacity="0.4" />
            <Stop offset="1" stopColor="#0F2A24" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="screenGlow" cx="0.5" cy="0.5" r="0.6">
            <Stop offset="0" stopColor="#C8F1FF" />
            <Stop offset="1" stopColor="#9DE3FF" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="70" cy="124" rx={48 + level * 4} ry="13" fill="url(#towerShadowDesk)" />
        <Rect x="29" y="82" width="82" height="15" rx="6" fill={wood} />
        <Rect x="29" y="82" width="82" height="4" rx="2" fill="#FFFFFF" opacity="0.16" />
        <Rect x="39" y="97" width="8" height="22" rx="3" fill={wood} />
        <Rect x="93" y="97" width="8" height="22" rx="3" fill={wood} />
        <Rect x="47" y={59 - level * 3} width="46" height="29" rx="5" fill={screen} />
        <Rect x="52" y={64 - level * 3} width="36" height="18" rx="3" fill="url(#screenGlow)" opacity="0.92" />
        {level >= 3 ? <Rect x="98" y="66" width="9" height="16" rx="3" fill="#64C987" /> : null}
        {level >= 4 ? <Circle cx="101" cy="58" r="6" fill="#FFE08A" /> : null}
      </Svg>
    );
  }

  const shade = warning ? "#9A6A2E" : "#285D84";
  const top = 92 - level * 13;

  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      <Defs>
        <RadialGradient id="towerShadow" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#0F2A24" stopOpacity="0.4" />
          <Stop offset="1" stopColor="#0F2A24" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="towerBody" x1="45" y1={top} x2="95" y2="118" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={warning ? "#F0C879" : "#8FC2F2"} />
          <Stop offset="1" stopColor={warning ? "#D7A33D" : "#5A8FC9"} />
        </LinearGradient>
      </Defs>
      <Ellipse cx="70" cy="124" rx={48 + level * 4} ry="13" fill="url(#towerShadow)" />
      <G>
        <Rect x="45" y={top} width="50" height={118 - top} rx="7" fill="url(#towerBody)" />
        <Rect x="47" y={top + 2} width="6" height={114 - top} rx="3" fill="#FFFFFF" opacity="0.18" />
        <Path d={`M39 ${top + 2} L70 ${top - 27} L101 ${top + 2} Z`} fill={shade} />
        {Array.from({ length: level + 2 }).map((_, index) => (
          <Rect key={index} x={index % 2 ? "73" : "57"} y={top + 12 + index * 10} width="9" height="7" rx="2" fill="#FFF8E9" opacity="0.86" />
        ))}
        {level >= 4 ? <Circle cx="70" cy={top - 31} r="7" fill="#FFE08A" /> : null}
      </G>
    </Svg>
  );
}