"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeSymptomTags } from "@/lib/symptoms";

export async function createSymptomEntry(formData: FormData) {
  const occurredRaw = String(formData.get("occurred_at") ?? "");
  const severity = Number(formData.get("severity"));
  const meds = String(formData.get("meds") ?? "").slice(0, 2000);
  const notes = String(formData.get("notes") ?? "").slice(0, 8000);
  const tagsRaw = formData.getAll("tags").map(String);

  const tags = normalizeSymptomTags(tagsRaw);

  if (!occurredRaw) {
    throw new Error("Date and time are required.");
  }

  const occurredAt = new Date(occurredRaw);
  if (Number.isNaN(occurredAt.getTime())) {
    throw new Error("Invalid date and time.");
  }

  if (!Number.isInteger(severity) || severity < 1 || severity > 5) {
    throw new Error("Severity must be between 1 and 5.");
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("symptom_entry").insert({
    occurred_at: occurredAt.toISOString(),
    severity,
    tags,
    meds,
    notes,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/symptoms");
}

export async function deleteSymptomEntry(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("symptom_entry").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/symptoms");
}
