"use client";

import Link from "next/link";
import { monthShortName } from "@/lib/dates";
import { cn } from "@/lib/utils";

type Props = {
  year: number;
  activeMonth: number;
  /** Month numbers (1–12), typically newest-first */
  months: number[];
};

export function DiaryMonthTabs({ year, activeMonth, months }: Props) {
  const list =
    months.length > 0 ? months : [activeMonth].filter((m) => m >= 1 && m <= 12);

  return (
    <div className="flex items-stretch gap-0 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex min-w-0 flex-1 items-stretch overflow-x-auto scrollbar-hide">
        <ul className="flex">
          {list.map((m) => {
            const active = m === activeMonth;
            return (
              <li key={m} className="shrink-0">
                <Link
                  href={`/diary?date=${year}-${String(m).padStart(2, "0")}-01`}
                  className={cn(
                    "relative block px-4 py-3 text-[0.95rem] font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {monthShortName(m)}
                  {active ? (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary"
                      aria-hidden
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
