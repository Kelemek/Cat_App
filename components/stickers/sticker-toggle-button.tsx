"use client";

import { PawPrint } from "lucide-react";
import { useStickerOverlay } from "@/components/stickers/sticker-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  /** Album header uses lighter chrome */
  album?: boolean;
};

export function StickerToggleButton({ album }: Props) {
  const { setStudioOpen } = useStickerOverlay();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => setStudioOpen(true)}
      className={cn(
        "gap-1.5 px-2",
        album
          ? "text-muted-foreground hover:bg-muted hover:text-primary"
          : "text-muted-foreground hover:text-primary",
      )}
      title="Open sticker studio — place your own stickers"
      data-sticker-place-ignore
    >
      <PawPrint className="size-4" strokeWidth={2} />
      <span className="hidden sm:inline">Stickers</span>
    </Button>
  );
}
