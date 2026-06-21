import Svg, { Circle, Ellipse, G, Rect, Path } from "react-native-svg";
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
        <Ellipse cx="70" cy="122" rx={42 + level * 3} ry="10" fill="#17382E" opacity="0.2" />
        <Rect x="29" y="82" width="82" height="15" rx="6" fill={wood} />
        <Rect x="39" y="97" width="8" height="22" rx="3" fill={wood} />
        <Rect x="93" y="97" width="8" height="22" rx="3" fill={wood} />
        <Rect x="47" y={59 - level * 3} width="46" height="29" rx="5" fill={screen} />
        <Rect x="52" y={64 - level * 3} width="36" height="18" rx="3" fill="#9DE3FF" opacity="0.9" />
        {level >= 3 ? <Rect x="98" y="66" width="9" height="16" rx="3" fill="#64C987" /> : null}
        {level >= 4 ? <Circle cx="101" cy="58" r="6" fill="#FFE08A" /> : null}
      </Svg>
    );
  }

  const body = warning ? "#D7A33D" : "#6AA7E8";
  const shade = warning ? "#9A6A2E" : "#285D84";
  const top = 92 - level * 13;

  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      <Ellipse cx="70" cy="122" rx={42 + level * 3} ry="10" fill="#17382E" opacity="0.2" />
      <G>
        <Rect x="45" y={top} width="50" height={118 - top} rx="7" fill={body} />
        <Path d={`M39 ${top + 2} L70 ${top - 27} L101 ${top + 2} Z`} fill={shade} />
        {Array.from({ length: level + 2 }).map((_, index) => (
          <Rect key={index} x={index % 2 ? "73" : "57"} y={top + 12 + index * 10} width="9" height="7" rx="2" fill="#FFF8E9" opacity="0.86" />
        ))}
        {level >= 4 ? <Circle cx="70" cy={top - 31} r="7" fill="#FFE08A" /> : null}
      </G>
    </Svg>
  );
}
