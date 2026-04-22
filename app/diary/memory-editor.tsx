"use client";

import { useState, useTransition } from "react";
import { saveDiaryMemory } from "@/app/actions/diary";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  diaryDate: string;
  initialText: string;
};

export function MemoryEditor({ diaryDate, initialText }: Props) {
  const [text, setText] = useState(initialText);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function onSave() {
    setMessage(null);
    startTransition(async () => {
      try {
        await saveDiaryMemory(diaryDate, text);
        setMessage("Saved.");
      } catch (e) {
        setMessage(e instanceof Error ? e.message : "Could not save.");
      }
    });
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="memory">Memory for this day</Label>
      <Textarea
        id="memory"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Soft paws, silly moments, vet updates, anything you want to remember…"
        className="resize-y min-h-[10rem]"
        disabled={pending}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={onSave} disabled={pending}>
          {pending ? "Saving…" : "Save memory"}
        </Button>
        {message ? (
          <span className="text-sm text-muted-foreground" role="status">
            {message}
          </span>
        ) : null}
      </div>
    </div>
  );
}
