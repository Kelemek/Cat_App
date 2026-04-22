import { createAdminClient } from "@/lib/supabase/admin";

export type SymptomRow = {
  id: string;
  occurred_at: string;
  severity: number;
  tags: string[];
  meds: string;
  notes: string;
  created_at: string;
};

export async function listSymptomEntries(): Promise<SymptomRow[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("symptom_entry")
    .select("id, occurred_at, severity, tags, meds, notes, created_at")
    .order("occurred_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SymptomRow[];
}
