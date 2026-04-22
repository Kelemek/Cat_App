import { SymptomForm } from "@/app/symptoms/symptom-form";
import { SymptomList } from "@/app/symptoms/symptom-list";
import { SiteShell } from "@/components/site-shell";
import { listSymptomEntries } from "@/lib/data/symptoms";

export const dynamic = "force-dynamic";

function defaultDatetimeLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${y}-${m}-${day}T${h}:${min}`;
}

export default async function SymptomsPage() {
  const entries = await listSymptomEntries();

  return (
    <SiteShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Symptom journal
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track what happened, how strong it felt, and what you did—especially
            helpful for floppy, long-haired breeds who hide discomfort well.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <SymptomForm defaultDatetimeLocal={defaultDatetimeLocal()} />
          <SymptomList entries={entries} />
        </div>
      </div>
    </SiteShell>
  );
}
