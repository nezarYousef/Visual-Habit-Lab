const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function toDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function daysBetween(fromDateKey: string, toDateKeyValue = toDateKey()): number {
  const from = startOfLocalDay(parseDateKey(fromDateKey)).getTime();
  const to = startOfLocalDay(parseDateKey(toDateKeyValue)).getTime();

  return Math.round((to - from) / DAY_MS);
}

export function lastSevenDateKeys(today = new Date()): string[] {
  return Array.from({ length: 7 }, (_, index) => toDateKey(addDays(today, index - 6)));
}

export function formatShortDay(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString(undefined, { weekday: "short" });
}
