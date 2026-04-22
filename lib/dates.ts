export function todayLocalISODate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODateOrToday(value: string | undefined): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return todayLocalISODate();
  }
  const t = Date.parse(`${value}T12:00:00`);
  if (Number.isNaN(t)) {
    return todayLocalISODate();
  }
  return value;
}

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function monthShortName(month1: number): string {
  const i = month1 - 1;
  if (i < 0 || i > 11) {
    return "";
  }
  return MONTH_SHORT[i] ?? "";
}

export function monthYearFromISODate(iso: string): {
  year: number;
  month: number;
  day: number;
} {
  const y = Number(iso.slice(0, 4));
  const m = Number(iso.slice(5, 7));
  const d = Number(iso.slice(8, 10));
  if (!y || !m || !d) {
    const t = todayLocalISODate();
    return monthYearFromISODate(t);
  }
  return { year: y, month: m, day: d };
}

export function firstOfMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

export function lastDayOfCalendarMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}
