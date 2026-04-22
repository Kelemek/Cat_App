"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { X } from "lucide-react";
import { BUILTIN_STICKERS } from "@/components/stickers/builtin-registry";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MAX_COLLECTION_ITEMS,
  MAX_DATA_URL_LENGTH,
  newStickerId,
  type CollectionItemV1,
} from "@/lib/stickers/user-storage";
import {
  defaultWidthForBuiltin,
  defaultWidthForCustom,
  defaultWidthForText,
  type PendingPlacement,
} from "@/components/stickers/sticker-placement-host";
import { TextStickerFace } from "@/components/stickers/text-sticker-face";
import {
  MAX_STICKER_TEXT_CHARS,
  TEXT_STICKER_SHAPES,
  type TextStickerShapeId,
} from "@/lib/stickers/text-sticker-shapes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStickerDragPointerDown: (
    pending: PendingPlacement,
    e: ReactPointerEvent,
  ) => void;
  placedCount: number;
  collection: CollectionItemV1[];
  onClearPlaced: () => void | Promise<void>;
  onRemoveCollectionItem: (id: string) => void | Promise<void>;
  onAddCollectionItem: (item: CollectionItemV1) => void | Promise<void>;
};

export function StickerStudioModal({
  open,
  onOpenChange,
  onStickerDragPointerDown,
  placedCount,
  collection,
  onClearPlaced,
  onRemoveCollectionItem,
  onAddCollectionItem,
}: Props) {
  const [tab, setTab] = useState<"builtin" | "yours" | "text">("builtin");
  const [textDraft, setTextDraft] = useState("");
  const [textShape, setTextShape] = useState<TextStickerShapeId>("bubble");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    if (next) {
      setUploadError(null);
    }
    onOpenChange(next);
  }

  function clearAllPlaced() {
    if (!confirm("Remove all stickers you placed on this page?")) {
      return;
    }
    void onClearPlaced();
  }

  function removeFromCollection(id: string) {
    void onRemoveCollectionItem(id);
  }

  async function onFilesSelected(files: FileList | null) {
    setUploadError(null);
    if (!files?.length) {
      return;
    }
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setUploadError("Image must be about 1.5 MB or smaller.");
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result ?? ""));
      r.onerror = () => reject(new Error("read failed"));
      r.readAsDataURL(file);
    }).catch(() => "");

    if (!dataUrl || dataUrl.length > MAX_DATA_URL_LENGTH) {
      setUploadError("File is too large for browser storage.");
      return;
    }

    if (collection.length >= MAX_COLLECTION_ITEMS) {
      setUploadError(`Collection full (max ${MAX_COLLECTION_ITEMS}). Remove one first.`);
      return;
    }

    const item: CollectionItemV1 = {
      id: newStickerId(),
      dataUrl,
      name: file.name.replace(/\.[^/.]+$/, "") || "Sticker",
      createdAt: Date.now(),
    };
    void onAddCollectionItem(item);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[min(90vh,640px)] overflow-y-auto sm:max-w-md"
        data-sticker-place-ignore
      >
        <DialogHeader>
          <DialogTitle>Sticker studio</DialogTitle>
          <DialogDescription>
            Press and drag a sticker out of the studio, then release on the page
            to place it. After placing, drag to move, use the top handle to
            spin, or the top-left handle to resize. Stickers are saved per page
            on the server; your upload collection is shared across pages.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 border-b border-border pb-2" data-sticker-place-ignore>
            <Button
              type="button"
              variant={tab === "builtin" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTab("builtin")}
            >
              Built-in
            </Button>
            <Button
              type="button"
              variant={tab === "yours" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTab("yours")}
            >
              My collection
            </Button>
            <Button
              type="button"
              variant={tab === "text" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTab("text")}
            >
              Text
            </Button>
          </div>

          {tab === "builtin" ? (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4" data-sticker-place-ignore>
              {BUILTIN_STICKERS.map((b) => {
                const C = b.Component;
                return (
                  <li key={b.id}>
                    <button
                      type="button"
                      onPointerDown={(e) => {
                        setUploadError(null);
                        onStickerDragPointerDown(
                          {
                            kind: "builtin",
                            id: b.id,
                            defaultWidth: defaultWidthForBuiltin(),
                          },
                          e,
                        );
                      }}
                      className="flex w-full cursor-grab flex-col items-center gap-1 rounded-lg border border-border bg-card p-2 text-center transition-colors hover:bg-muted active:cursor-grabbing"
                    >
                      <C className="size-12 pointer-events-none" />
                      <span className="text-xs text-muted-foreground pointer-events-none">
                        {b.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : tab === "yours" ? (
            <div className="space-y-3" data-sticker-place-ignore>
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onFilesSelected(e.target.files)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                >
                  Upload image to collection
                </Button>
                <p className="mt-1 text-xs text-muted-foreground">
                  PNG, JPEG, WebP, GIF — up to ~1.5 MB. Max {MAX_COLLECTION_ITEMS}{" "}
                  saved stickers.
                </p>
                {uploadError ? (
                  <p className="mt-1 text-xs text-destructive">{uploadError}</p>
                ) : null}
              </div>
              {collection.length === 0 ? (
                <p className="text-sm text-muted-foreground">No uploads yet.</p>
              ) : (
                <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {collection.map((item) => (
                    <li key={item.id} className="group relative">
                      <button
                        type="button"
                        onPointerDown={(e) => {
                          setUploadError(null);
                          onStickerDragPointerDown(
                            {
                              kind: "custom",
                              dataUrl: item.dataUrl,
                              defaultWidth: defaultWidthForCustom(),
                            },
                            e,
                          );
                        }}
                        className="relative w-full cursor-grab overflow-hidden rounded-lg border border-border bg-muted active:cursor-grabbing"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.dataUrl}
                          alt=""
                          className="pointer-events-none aspect-square w-full object-cover"
                        />
                        <span className="sr-only">Drag to place {item.name}</span>
                      </button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-sm"
                        className="absolute right-0.5 top-0.5 z-10 size-6 opacity-0 transition-opacity group-hover:opacity-100"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCollection(item.id);
                        }}
                        aria-label={`Remove ${item.name} from collection`}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="space-y-4" data-sticker-place-ignore>
              <div className="space-y-2">
                <Label htmlFor="sticker-text-draft">Your message</Label>
                <Input
                  id="sticker-text-draft"
                  value={textDraft}
                  maxLength={MAX_STICKER_TEXT_CHARS}
                  onChange={(e) => setTextDraft(e.target.value)}
                  placeholder="e.g. Purrfect day ✿"
                  className="font-heading"
                />
                <p className="text-xs text-muted-foreground">
                  {textDraft.length}/{MAX_STICKER_TEXT_CHARS} — short & sweet works best.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Shape</p>
                <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {TEXT_STICKER_SHAPES.map((shape) => (
                    <li key={shape.id}>
                      <button
                        type="button"
                        onClick={() => setTextShape(shape.id)}
                        className={cn(
                          "flex w-full flex-col items-center gap-1 rounded-lg border p-2 text-center transition-colors",
                          textShape === shape.id
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:bg-muted",
                        )}
                      >
                        <div className="pointer-events-none w-full max-w-18">
                          <TextStickerFace
                            text={textDraft.trim() ? textDraft : "Hi!"}
                            shape={shape.id}
                            className="min-h-8 px-1.5 py-1 text-[0.65rem]"
                          />
                        </div>
                        <span className="text-[0.65rem] text-muted-foreground">
                          {shape.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Press and drag the preview below onto the page to place it.
                </p>
                <button
                  type="button"
                  disabled={!textDraft.trim()}
                  onPointerDown={(e) => {
                    setUploadError(null);
                    const t = textDraft.trim().slice(0, MAX_STICKER_TEXT_CHARS);
                    if (!t) {
                      return;
                    }
                    onStickerDragPointerDown(
                      {
                        kind: "text",
                        text: t,
                        shape: textShape,
                        defaultWidth: defaultWidthForText(),
                      },
                      e,
                    );
                  }}
                  className={cn(
                    "flex w-full cursor-grab flex-col items-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-muted/30 p-4 transition-colors",
                    "hover:bg-muted/50 active:cursor-grabbing",
                    !textDraft.trim() && "cursor-not-allowed opacity-50",
                  )}
                >
                  <div className="pointer-events-none w-full max-w-[min(100%,280px)]">
                    <TextStickerFace text={textDraft.trim() || "…"} shape={textShape} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {textDraft.trim() ? "Drag me out!" : "Type a message first"}
                  </span>
                </button>
              </div>
            </div>
          )}

          <div className="border-t border-border pt-3" data-sticker-place-ignore>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-destructive hover:text-destructive"
              onClick={clearAllPlaced}
            >
              Clear all placed stickers
            </Button>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              {placedCount} on screen
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
