"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  DIARY_ALLOWED_MIME,
  DIARY_PHOTO_MAX_BYTES,
} from "@/lib/diary-upload";
import { processDiaryImageForStorage } from "@/lib/image/process-diary-photo";

const BUCKET = "diary-photos";

async function ensureDiaryDay(supabase: ReturnType<typeof createAdminClient>, diaryDate: string) {
  const { data } = await supabase
    .from("diary_day")
    .select("diary_date")
    .eq("diary_date", diaryDate)
    .maybeSingle();

  if (!data) {
    const { error } = await supabase.from("diary_day").insert({
      diary_date: diaryDate,
      memory_text: "",
    });
    if (error) {
      throw new Error(error.message);
    }
  }
}

export async function saveDiaryMemory(diaryDate: string, memoryText: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(diaryDate)) {
    throw new Error("Invalid date.");
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("diary_day").upsert(
    {
      diary_date: diaryDate,
      memory_text: memoryText,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "diary_date" },
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/diary");
}

export async function uploadDiaryPhoto(formData: FormData) {
  const diaryDate = String(formData.get("date") ?? "");
  const file = formData.get("file");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(diaryDate)) {
    throw new Error("Invalid date.");
  }

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose a photo to upload.");
  }

  if (file.size > DIARY_PHOTO_MAX_BYTES) {
    throw new Error("Photo must be 5 MB or smaller.");
  }

  const mime = file.type;
  if (!DIARY_ALLOWED_MIME.has(mime)) {
    throw new Error("Use JPEG, PNG, WebP, or GIF.");
  }

  const supabase = createAdminClient();
  await ensureDiaryDay(supabase, diaryDate);

  const raw = Buffer.from(new Uint8Array(await file.arrayBuffer()));
  let stored: Buffer;
  try {
    stored = await processDiaryImageForStorage(raw, mime);
  } catch (e) {
    throw e instanceof Error ? e : new Error("Could not process image.");
  }

  const id = crypto.randomUUID();
  const path = `diary/${diaryDate}/${id}.webp`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, stored, {
      contentType: "image/webp",
      upsert: false,
    });

  if (upErr) {
    throw new Error(upErr.message);
  }

  const { data: existing } = await supabase
    .from("diary_photo")
    .select("sort_order")
    .eq("diary_date", diaryDate)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sortOrder = (existing?.sort_order ?? -1) + 1;

  const { error: rowErr } = await supabase.from("diary_photo").insert({
    diary_date: diaryDate,
    storage_path: path,
    caption: "",
    sort_order: sortOrder,
  });

  if (rowErr) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw new Error(rowErr.message);
  }

  revalidatePath("/diary");
}

export async function deleteDiaryPhoto(photoId: string) {
  const supabase = createAdminClient();
  const { data: row, error: fetchErr } = await supabase
    .from("diary_photo")
    .select("storage_path")
    .eq("id", photoId)
    .maybeSingle();

  if (fetchErr || !row) {
    throw new Error(fetchErr?.message ?? "Photo not found.");
  }

  await supabase.storage.from(BUCKET).remove([row.storage_path]);
  const { error } = await supabase.from("diary_photo").delete().eq("id", photoId);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/diary");
}
