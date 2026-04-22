"use client";

import { Button } from "@/components/ui/button";

type Props = {
  active: boolean;
  label: string;
  onCancel: () => void;
};

export function StickerPlacementBanner({
  active,
  label,
  onCancel,
}: Props) {
  if (!active) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[90] border-t border-border bg-card/95 px-4 py-3 text-center shadow-lg backdrop-blur-sm supports-backdrop-filter:backdrop-blur-md"
      data-sticker-place-ignore
      role="status"
    >
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Drag over the page and release to drop (not on menus or dialogs). Press{" "}
        <kbd className="rounded border bg-muted px-1">Esc</kbd> to cancel.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
}
