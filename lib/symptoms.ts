export const SYMPTOM_TAGS = [
  { id: "vomiting", label: "Vomiting" },
  { id: "appetite", label: "Appetite change" },
  { id: "lethargy", label: "Lethargy" },
  { id: "litterbox", label: "Litter box" },
  { id: "coughing", label: "Coughing / breathing" },
  { id: "other", label: "Other" },
] as const;

export type SymptomTagId = (typeof SYMPTOM_TAGS)[number]["id"];

const ALLOWED = new Set<string>(SYMPTOM_TAGS.map((t) => t.id));

export function normalizeSymptomTags(raw: string[]): string[] {
  const out: string[] = [];
  for (const t of raw) {
    if (ALLOWED.has(t) && !out.includes(t)) {
      out.push(t);
    }
  }
  return out;
}
