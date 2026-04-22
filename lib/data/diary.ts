import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "diary-photos";
const SIGNED_SEC = 60 * 60;

export type DiaryPhotoWithUrl = {
  id: string;
  diary_date: string;
  storage_path: string;
  caption: string;
  sort_order: number;
  signedUrl: string | null;
};

export async function getDiaryDay(diaryDate: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("diary_day")
    .select("diary_date, memory_text, updated_at")
    .eq("diary_date", diaryDate)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getDiaryPhotosForDate(
  diaryDate: string,
): Promise<DiaryPhotoWithUrl[]> {
  const supabase = createAdminClient();
  const { data: rows, error } = await supabase
    .from("diary_photo")
    .select("id, diary_date, storage_path, caption, sort_order")
    .eq("diary_date", diaryDate)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const out: DiaryPhotoWithUrl[] = [];
  for (const row of rows ?? []) {
    const { data: signed, error: signErr } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(row.storage_path, SIGNED_SEC);

    out.push({
      ...row,
      signedUrl: signErr ? null : signed?.signedUrl ?? null,
    });
  }

  return out;
}

export async function getDiaryPhotosForMonth(
  year: number,
  month: number,
): Promise<DiaryPhotoWithUrl[]> {
  const supabase = createAdminClient();
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const ld = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(ld).padStart(2, "0")}`;

  const { data: rows, error } = await supabase
    .from("diary_photo")
    .select("id, diary_date, storage_path, caption, sort_order")
    .gte("diary_date", start)
    .lte("diary_date", end)
    .order("diary_date", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const out: DiaryPhotoWithUrl[] = [];
  for (const row of rows ?? []) {
    const { data: signed, error: signErr } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(row.storage_path, SIGNED_SEC);

    out.push({
      ...row,
      signedUrl: signErr ? null : signed?.signedUrl ?? null,
    });
  }

  return out;
}

export async function getMonthsWithActivityInYear(year: number): Promise<number[]> {
  const supabase = createAdminClient();
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;

  const [{ data: photos, error: pErr }, { data: days, error: dErr }] =
    await Promise.all([
      supabase.from("diary_photo").select("diary_date").gte("diary_date", start).lte("diary_date", end),
      supabase.from("diary_day").select("diary_date").gte("diary_date", start).lte("diary_date", end),
    ]);

  if (pErr || dErr) {
    throw new Error(pErr?.message ?? dErr?.message ?? "Query failed.");
  }

  const months = new Set<number>();
  for (const r of photos ?? []) {
    months.add(Number(r.diary_date.slice(5, 7)));
  }
  for (const r of days ?? []) {
    months.add(Number(r.diary_date.slice(5, 7)));
  }

  return Array.from(months).filter((m) => m >= 1 && m <= 12).sort((a, b) => b - a);
}

export async function getRecentDiaryDates(limit = 40): Promise<string[]> {
  const supabase = createAdminClient();

  const [{ data: dayRows, error: dErr }, { data: photoRows, error: pErr }] =
    await Promise.all([
      supabase.from("diary_day").select("diary_date"),
      supabase.from("diary_photo").select("diary_date"),
    ]);

  if (dErr || pErr) {
    throw new Error(dErr?.message ?? pErr?.message ?? "Query failed.");
  }

  const dates = new Set<string>();
  for (const r of dayRows ?? []) {
    dates.add(r.diary_date);
  }
  for (const r of photoRows ?? []) {
    dates.add(r.diary_date);
  }

  return Array.from(dates)
    .filter((d) => d)
    .sort()
    .reverse()
    .slice(0, limit);
}
