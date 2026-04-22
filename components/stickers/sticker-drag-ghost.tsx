"use client";

import { BuiltinStickerSvg } from "@/components/stickers/builtin-registry";
import type { PendingPlacement } from "@/components/stickers/sticker-placement-host";
import { TextStickerFace } from "@/components/stickers/text-sticker-face";

type Props = {
  pending: PendingPlacement;
  x: number;
  y: number;
};

export function StickerDragGhost({ pending, x, y }: Props) {
  const w = pending.defaultWidth;
  return (
    <div
      className="pointer-events-none fixed z-9998 opacity-95 drop-shadow-xl"
      style={{
        left: x,
        top: y,
        width: w,
        maxWidth: "min(40vw, 200px)",
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden
    >
      {pending.kind === "builtin" ? (
        <BuiltinStickerSvg id={pending.id} className="size-full max-h-[min(22vh,200px)] w-auto" />
      ) : pending.kind === "text" ? (
        <TextStickerFace
          text={pending.text}
          shape={pending.shape}
          className="max-h-[min(22vh,200px)] w-full"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={pending.dataUrl}
          alt=""
          className="pointer-events-none max-h-[min(22vh,200px)] w-full object-contain"
          draggable={false}
        />
      )}
    </div>
  );
}
