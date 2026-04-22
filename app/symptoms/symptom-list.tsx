"use client";

import { useTransition } from "react";
import { deleteSymptomEntry } from "@/app/actions/symptoms";
import type { SymptomRow } from "@/lib/data/symptoms";
import { SYMPTOM_TAGS } from "@/lib/symptoms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const tagLabel = (id: string) =>
  SYMPTOM_TAGS.find((t) => t.id === id)?.label ?? id;

type Props = {
  entries: SymptomRow[];
};

export function SymptomList({ entries }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">History</CardTitle>
        <CardDescription>Newest first. Delete if you logged something by mistake.</CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No symptom entries yet.</p>
        ) : (
          <ul className="space-y-4">
            {entries.map((e) => (
              <li
                key={e.id}
                className="rounded-lg border border-border bg-card/60 p-4 shadow-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">
                      {new Date(e.occurred_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Severity{" "}
                      <span className="font-medium text-foreground">{e.severity}</span>{" "}
                      / 5
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={pending}
                    onClick={() => {
                      if (!confirm("Delete this symptom entry?")) {
                        return;
                      }
                      startTransition(async () => {
                        await deleteSymptomEntry(e.id);
                      });
                    }}
                  >
                    Delete
                  </Button>
                </div>
                {e.tags.length > 0 ? (
                  <p className="mt-2 text-sm">
                    <span className="text-muted-foreground">Tags: </span>
                    {e.tags.map(tagLabel).join(", ")}
                  </p>
                ) : null}
                {e.meds ? (
                  <p className="mt-2 text-sm">
                    <span className="text-muted-foreground">Meds: </span>
                    {e.meds}
                  </p>
                ) : null}
                {e.notes ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm">{e.notes}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
