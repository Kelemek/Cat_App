"use client";

import { cn } from "@/lib/utils";
import type { TextStickerShapeId } from "@/lib/stickers/text-sticker-shapes";

type Props = {
  text: string;
  shape: TextStickerShapeId;
  className?: string;
};

/**
 * Soft 4-point star (compass / ✦ style) — shallow indents read cuter on small
 * stickers than a sharp 5-point polygon.
 */
const STAR_CLIP =
  "polygon(50% 6%, 64% 36%, 94% 50%, 64% 64%, 50% 94%, 36% 64%, 6% 50%, 36% 36%)";

/**
 * Flat-top hex “gem” cut — even, readable silhouette (replaces the old jagged
 * sparkle blob). Id stays `sparkle` for saved stickers.
 */
const SPARKLE_CLIP =
  "polygon(16% 14%, 84% 14%, 94% 50%, 84% 86%, 16% 86%, 6% 50%)";

/** Chubby arrow pointing right (shaft left, tip right) — matches image arrow vibe. */
const ARROW_RIGHT_CLIP =
  "polygon(0% 18%, 58% 18%, 58% 6%, 100% 50%, 58% 94%, 58% 82%, 0% 82%)";

/** Mirror of `ARROW_RIGHT_CLIP`. */
const ARROW_LEFT_CLIP =
  "polygon(100% 18%, 42% 18%, 42% 6%, 0% 50%, 42% 94%, 42% 82%, 100% 82%)";

const inner =
  "flex min-h-[2.25rem] w-full max-w-full items-center justify-center px-2.5 py-2 text-center font-heading text-[0.8125rem] font-semibold leading-tight tracking-tight text-pink-950 break-words [text-wrap:pretty]";

export function TextStickerFace({ text, shape, className }: Props) {
  const content = text.trim() || "\u00A0";

  switch (shape) {
    case "bubble":
      return (
        <div
          className={cn(
            "relative border-2 border-rose-200/90 bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50 shadow-md",
            "rounded-[1.75rem]",
            inner,
            className,
          )}
        >
          {content}
        </div>
      );
    case "star":
      return (
        <div
          className={cn(
            "relative border-2 border-amber-200/80 bg-gradient-to-br from-amber-50 via-pink-50 to-rose-100 shadow-md",
            inner,
            className,
          )}
          style={{ clipPath: STAR_CLIP }}
        >
          {content}
        </div>
      );
    case "cloud":
      return (
        <div
          className={cn(
            "relative border-2 border-sky-200/85 bg-gradient-to-b from-sky-50 to-white shadow-md",
            "rounded-[3rem_3rem_2.25rem_2.25rem]",
            inner,
            className,
          )}
        >
          {content}
        </div>
      );
    case "ribbon":
      return (
        <div
          className={cn(
            "relative border-2 border-violet-200/85 bg-gradient-to-r from-violet-100 via-fuchsia-100 to-pink-100 shadow-md",
            "rounded-lg",
            inner,
            "-skew-x-6",
            className,
          )}
        >
          <span className="block skew-x-6">{content}</span>
        </div>
      );
    case "sparkle":
      return (
        <div
          className={cn(
            "relative border-2 border-fuchsia-200/75 bg-gradient-to-br from-fuchsia-50 via-pink-100 to-amber-50 shadow-md",
            inner,
            className,
          )}
          style={{ clipPath: SPARKLE_CLIP }}
        >
          {content}
        </div>
      );
    case "arrow-right":
      return (
        <div
          className={cn(
            "relative border-2 border-[#6a82b8]/90 bg-gradient-to-br from-[#eef4ff] to-[#c8d8f8] shadow-md",
            inner,
            "px-3 text-indigo-950",
            className,
          )}
          style={{ clipPath: ARROW_RIGHT_CLIP }}
        >
          {content}
        </div>
      );
    case "arrow-left":
      return (
        <div
          className={cn(
            "relative border-2 border-[#6a82b8]/90 bg-gradient-to-br from-[#eef4ff] to-[#c8d8f8] shadow-md",
            inner,
            "px-3 text-indigo-950",
            className,
          )}
          style={{ clipPath: ARROW_LEFT_CLIP }}
        >
          {content}
        </div>
      );
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}
