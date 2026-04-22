"use client";

import type { BuiltinStickerId } from "@/components/stickers/builtin-registry";
import {
  MAX_STICKER_TEXT_CHARS,
  type TextStickerShapeId,
} from "@/lib/stickers/text-sticker-shapes";
import { getStickerAnchorElement, newStickerId, type PlacedStickerV1 } from "@/lib/stickers/user-storage";

export type PendingPlacement =
  | { kind: "builtin"; id: BuiltinStickerId; defaultWidth: number }
  | { kind: "custom"; dataUrl: string; defaultWidth: number }
  | {
      kind: "text";
      text: string;
      shape: TextStickerShapeId;
      defaultWidth: number;
    };

const DEFAULT_BUILTIN_WIDTH = 72;
const DEFAULT_CUSTOM_WIDTH = 96;
const DEFAULT_TEXT_WIDTH = 140;

export function stickerPendingLabel(): string {
  return "Dragging sticker — release on the page to place";
}

export function ignoreStickerDropTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }
  return Boolean(target.closest("[data-sticker-place-ignore]"));
}

/** Build a placed sticker from a drop position; returns null if the drop target is ignored. */
export function buildPlacedStickerAtPoint(
  placement: PendingPlacement,
  clientX: number,
  clientY: number,
): PlacedStickerV1 | null {
  const target = document.elementFromPoint(clientX, clientY);
  if (ignoreStickerDropTarget(target)) {
    return null;
  }

  const anchor = getStickerAnchorElement();
  const rotationDeg = (Math.random() * 10 - 5) | 0;
  const widthPx = placement.defaultWidth;

  const content: Pick<
    PlacedStickerV1,
    "builtinId" | "dataUrl" | "stickerText" | "stickerShape"
  > =
    placement.kind === "builtin"
      ? { builtinId: placement.id }
      : placement.kind === "custom"
        ? { dataUrl: placement.dataUrl }
        : {
            stickerText: placement.text.slice(0, MAX_STICKER_TEXT_CHARS),
            stickerShape: placement.shape,
          };

  const shared: Pick<PlacedStickerV1, "widthPx" | "rotationDeg"> & typeof content = {
    widthPx,
    rotationDeg,
    ...content,
  };

  let placed: PlacedStickerV1;

  if (anchor) {
    const r = anchor.getBoundingClientRect();
    const offsetLeftPx = clientX - r.left;
    const offsetTopPx = clientY - r.top;
    placed = {
      id: newStickerId(),
      xPct: 0,
      yPct: 0,
      scrollAnchored: true,
      offsetLeftPx,
      offsetTopPx,
      ...shared,
    };
  } else {
    const vw = window.innerWidth || 1;
    const vh = window.innerHeight || 1;
    placed = {
      id: newStickerId(),
      xPct: (clientX / vw) * 100,
      yPct: (clientY / vh) * 100,
      ...shared,
    };
  }

  return placed;
}

export function defaultWidthForBuiltin(): number {
  return DEFAULT_BUILTIN_WIDTH;
}

export function defaultWidthForCustom(): number {
  return DEFAULT_CUSTOM_WIDTH;
}

export function defaultWidthForText(): number {
  return DEFAULT_TEXT_WIDTH;
}
