"use client";

import { useState, useTransition } from "react";
import { createSymptomEntry } from "@/app/actions/symptoms";
import { SYMPTOM_TAGS } from "@/lib/symptoms";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  defaultDatetimeLocal: string;
};

export function SymptomForm({ defaultDatetimeLocal }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [severity, setSeverity] = useState(3);
  const [tags, setTags] = useState<Set<string>>(() => new Set());

  function toggleTag(id: string) {
    setTags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("severity", String(severity));
    for (const t of tags) {
      fd.append("tags", t);
    }
    startTransition(async () => {
      try {
        await createSymptomEntry(fd);
        form.reset();
        setSeverity(3);
        setTags(new Set());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save entry.");
      }
    });
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Log a symptom</CardTitle>
        <CardDescription>
          Structured notes help you spot patterns before the next vet visit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="occurred_at">When</Label>
            <Input
              id="occurred_at"
              name="occurred_at"
              type="datetime-local"
              required
              defaultValue={defaultDatetimeLocal}
              disabled={pending}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Label>Severity (1 = mild, 5 = urgent)</Label>
              <span className="text-sm tabular-nums text-muted-foreground">
                {severity}
              </span>
            </div>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[severity]}
              onValueChange={(v) => {
                const next = Array.isArray(v) ? v[0] : v;
                setSeverity(
                  typeof next === "number" && next >= 1 && next <= 5 ? next : 3,
                );
              }}
              disabled={pending}
              className="w-full"
            />
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Tags</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {SYMPTOM_TAGS.map((t) => (
                <label
                  key={t.id}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={tags.has(t.id)}
                    onCheckedChange={() => toggleTag(t.id)}
                    disabled={pending}
                  />
                  {t.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="meds">Medications or treatments (optional)</Label>
            <Input
              id="meds"
              name="meds"
              placeholder="e.g. ¼ tablet famotidine"
              disabled={pending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="What you observed, duration, context…"
              disabled={pending}
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
