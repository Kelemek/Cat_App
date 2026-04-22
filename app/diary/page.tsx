import { DiaryMonthGrid } from "@/app/diary/diary-month-grid";
import { DiaryMonthTabs } from "@/app/diary/diary-month-tabs";
import { DiaryDatePicker } from "@/app/diary/diary-date-picker";
import { MemoryEditor } from "@/app/diary/memory-editor";
import { PhotoBlock } from "@/app/diary/photo-block";
import { SiteShell } from "@/components/site-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { monthYearFromISODate, parseISODateOrToday } from "@/lib/dates";
import {
  getDiaryDay,
  getDiaryPhotosForDate,
  getDiaryPhotosForMonth,
  getMonthsWithActivityInYear,
} from "@/lib/data/diary";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function DiaryPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const diaryDate = parseISODateOrToday(sp.date);
  const { year, month } = monthYearFromISODate(diaryDate);

  const [dayRow, dayPhotos, monthPhotos, tabMonthsRaw] = await Promise.all([
    getDiaryDay(diaryDate),
    getDiaryPhotosForDate(diaryDate),
    getDiaryPhotosForMonth(year, month),
    getMonthsWithActivityInYear(year),
  ]);

  let tabMonths = tabMonthsRaw;
  if (!tabMonths.includes(month)) {
    tabMonths = [...tabMonths, month].sort((a, b) => b - a);
  }
  if (tabMonths.length === 0) {
    tabMonths = [month];
  }

  const memoryText = dayRow?.memory_text ?? "";

  return (
    <SiteShell variant="album">
      <div className="overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-0 sm:px-4">
          <DiaryMonthTabs year={year} activeMonth={month} months={tabMonths} />
        </div>

        <div className="mx-auto max-w-6xl space-y-8 px-2 pb-10 sm:px-4">
          <DiaryMonthGrid photos={monthPhotos} selectedDate={diaryDate} />

          <div id="day-tools" className="scroll-mt-4 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">This day</CardTitle>
                <CardDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Memory and uploads use the date you pick.
                  </span>
                  <DiaryDatePicker defaultValue={diaryDate} />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MemoryEditor
                  key={diaryDate}
                  diaryDate={diaryDate}
                  initialText={memoryText}
                />
              </CardContent>
            </Card>

            <PhotoBlock
              key={diaryDate}
              diaryDate={diaryDate}
              photos={dayPhotos}
              albumLayout
            />
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
