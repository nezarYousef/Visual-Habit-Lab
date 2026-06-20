export function withAlpha(hexColor: string, alpha: number): string {
  const clamped = Math.max(0, Math.min(1, alpha));
  const value = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, "0");

  return `${hexColor}${value}`;
}
