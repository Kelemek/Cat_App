"use client";

import { X } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { deleteDiaryPhoto, uploadDiaryPhoto } from "@/app/actions/diary";
import { DIARY_PHOTO_MAX_BYTES } from "@/lib/diary-upload";
import type { DiaryPhotoWithUrl } from "@/lib/data/diary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  diaryDate: string;
  photos: DiaryPhotoWithUrl[];
  /** Compact FamilyAlbum-style diary section */
  albumLayout?: boolean;
};

export function PhotoBlock({ diaryDate, photos, albumLayout }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const input = fileRef.current;
    const file = input?.files?.[0];
    if (!file) {
      setError("Choose a photo first.");
      return;
    }

    const fd = new FormData();
    fd.set("date", diaryDate);
    fd.set("file", file);

    startTransition(async () => {
      try {
        await uploadDiaryPhoto(fd);
        if (input) {
          input.value = "";
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      }
    });
  }

  function onDelete(id: string) {
    if (!confirm("Remove this photo from the diary?")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await deleteDiaryPhoto(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Delete failed.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-semibold text-foreground">
          {albumLayout ? `Photos for ${diaryDate}` : "Photos"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {albumLayout
            ? `Add shots for this day (WebP on upload, up to ${Math.round(DIARY_PHOTO_MAX_BYTES / (1024 * 1024))} MB).`
            : `Uploads are converted to WebP on the server (same framing as your original; EXIF orientation is applied first). Max ${Math.round(DIARY_PHOTO_MAX_BYTES / (1024 * 1024))} MB per file (JPEG, PNG, WebP, GIF). Animated GIFs become animated WebP when possible.`}
        </p>
      </div>

      <form
        onSubmit={onUpload}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-[0_8px_32px_-12px_rgba(180,100,120,0.15)]"
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <Label htmlFor="photo-file">Photo</Label>
            <Input
              id="photo-file"
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={pending}
            />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </form>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {photos.length === 0 ? (
        <p className="text-sm text-muted-foreground">No photos for this day yet.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {photos.map((p) => (
            <li
              key={p.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_8px_32px_-12px_rgba(180,100,120,0.15)]"
            >
              <div className="relative overflow-hidden bg-card">
                {p.signedUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.signedUrl}
                    alt="Diary photo"
                    className="mx-auto block h-auto w-full max-h-[min(85vh,1200px)] object-contain"
                  />
                ) : (
                  <div className="flex min-h-[120px] items-center justify-center p-4 text-center text-sm text-muted-foreground">
                    Could not load signed URL. Refresh the page.
                  </div>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  disabled={pending}
                  onClick={() => onDelete(p.id)}
                  className={cn(
                    "absolute right-2 top-2 z-10 size-8 rounded-full border border-border/90",
                    "bg-white/95 text-foreground shadow-md backdrop-blur-sm",
                    "hover:bg-white hover:text-destructive dark:bg-card/95 dark:hover:bg-card",
                  )}
                  aria-label="Remove photo"
                >
                  <X className="size-4" strokeWidth={2.5} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
