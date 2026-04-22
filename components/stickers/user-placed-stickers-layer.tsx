"use client";

import { Maximize2, RotateCw, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import {
  getStickerAnchorElement,
  isScrollAnchoredSticker,
  type PlacedStickerV1,
} from "@/lib/stickers/user-storage";
import {
  BuiltinStickerSvg,
  isBuiltinId,
} from "@/components/stickers/builtin-registry";
import { TextStickerFace } from "@/components/stickers/text-sticker-face";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  stickers: PlacedStickerV1[];
  onRemove: (id: string) => void;
  onUpdate: (
    id: string,
    patch: Partial<
      Pick<
        PlacedStickerV1,
        | "xPct"
        | "yPct"
        | "rotationDeg"
        | "widthPx"
        | "scrollAnchored"
        | "offsetLeftPx"
        | "offsetTopPx"
      >
    >,
  ) => void;
};

const RESIZE_MIN_PX = 40;
const RESIZE_MAX_PX = 320;

function clampPct(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function clampWidthPx(n: number) {
  return Math.min(RESIZE_MAX_PX, Math.max(RESIZE_MIN_PX, Math.round(n)));
}

function stickerCenterViewport(display: PlacedStickerV1): {
  cx: number;
  cy: number;
} {
  if (isScrollAnchoredSticker(display)) {
    const anchor = getStickerAnchorElement();
    if (anchor) {
      const r = anchor.getBoundingClientRect();
      return {
        cx: r.left + display.offsetLeftPx,
        cy: r.top + display.offsetTopPx,
      };
    }
  }
  const vw = window.innerWidth || 1;
  const vh = window.innerHeight || 1;
  return {
    cx: (display.xPct / 100) * vw,
    cy: (display.yPct / 100) * vh,
  };
}

function PlacedStickerItem({
  sticker: s,
  display,
  isActive,
  onRemove,
  onUpdate,
  setLive,
}: {
  sticker: PlacedStickerV1;
  display: PlacedStickerV1;
  isActive: boolean;
  onRemove: (id: string) => void;
  onUpdate: Props["onUpdate"];
  setLive: (v: PlacedStickerV1 | null) => void;
}) {
  const scroll = isScrollAnchoredSticker(display);

  const startMove = useCallback(
    (e: ReactPointerEvent) => {
      if (e.button !== 0) {
        return;
      }
      const el = e.currentTarget as HTMLElement;
      el.setPointerCapture(e.pointerId);
      const startX = e.clientX;
      const startY = e.clientY;
      const baseRot = display.rotationDeg;
      const baseW = display.widthPx;

      if (isScrollAnchoredSticker(display)) {
        const startOL = display.offsetLeftPx;
        const startOT = display.offsetTopPx;

        function move(ev: PointerEvent) {
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;
          setLive({
            ...display,
            offsetLeftPx: startOL + dx,
            offsetTopPx: startOT + dy,
            scrollAnchored: true,
          });
        }

        function up(ev: PointerEvent) {
          el.releasePointerCapture(ev.pointerId);
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerup", up);
          el.removeEventListener("pointercancel", up);
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;
          setLive(null);
          onUpdate(s.id, {
            offsetLeftPx: startOL + dx,
            offsetTopPx: startOT + dy,
            scrollAnchored: true,
            rotationDeg: baseRot,
            widthPx: baseW,
          });
        }

        el.addEventListener("pointermove", move);
        el.addEventListener("pointerup", up);
        el.addEventListener("pointercancel", up);
        return;
      }

      const baseXPct = display.xPct;
      const baseYPct = display.yPct;

      function move(ev: PointerEvent) {
        const vw = window.innerWidth || 1;
        const vh = window.innerHeight || 1;
        const xPct = clampPct(
          baseXPct + ((ev.clientX - startX) / vw) * 100,
          -20,
          120,
        );
        const yPct = clampPct(
          baseYPct + ((ev.clientY - startY) / vh) * 100,
          -20,
          120,
        );
        setLive({
          ...display,
          xPct,
          yPct,
          rotationDeg: baseRot,
          widthPx: baseW,
        });
      }

      function up(ev: PointerEvent) {
        el.releasePointerCapture(ev.pointerId);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        const vw = window.innerWidth || 1;
        const vh = window.innerHeight || 1;
        const xPct = clampPct(
          baseXPct + ((ev.clientX - startX) / vw) * 100,
          -20,
          120,
        );
        const yPct = clampPct(
          baseYPct + ((ev.clientY - startY) / vh) * 100,
          -20,
          120,
        );
        setLive(null);
        onUpdate(s.id, {
          xPct,
          yPct,
          rotationDeg: baseRot,
          widthPx: baseW,
        });
      }

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    },
    [display, onUpdate, s.id, setLive],
  );

  const startRotate = useCallback(
    (e: ReactPointerEvent) => {
      if (e.button !== 0) {
        return;
      }
      e.stopPropagation();
      const btn = e.currentTarget as HTMLElement;
      btn.setPointerCapture(e.pointerId);
      const baseRot = display.rotationDeg;
      const { cx, cy } = stickerCenterViewport(display);
      const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx);

      function move(ev: PointerEvent) {
        const a = Math.atan2(ev.clientY - cy, ev.clientX - cx);
        let deltaDeg = ((a - startAngle) * 180) / Math.PI;
        while (deltaDeg > 180) {
          deltaDeg -= 360;
        }
        while (deltaDeg < -180) {
          deltaDeg += 360;
        }
        const rotationDeg = baseRot + deltaDeg;
        setLive({
          ...display,
          rotationDeg,
        });
      }

      function up(ev: PointerEvent) {
        btn.releasePointerCapture(ev.pointerId);
        btn.removeEventListener("pointermove", move);
        btn.removeEventListener("pointerup", up);
        btn.removeEventListener("pointercancel", up);
        const a = Math.atan2(ev.clientY - cy, ev.clientX - cx);
        let deltaDeg = ((a - startAngle) * 180) / Math.PI;
        while (deltaDeg > 180) {
          deltaDeg -= 360;
        }
        while (deltaDeg < -180) {
          deltaDeg += 360;
        }
        const rotationDeg = baseRot + deltaDeg;
        setLive(null);
        const patch: Parameters<Props["onUpdate"]>[1] = {
          rotationDeg,
          widthPx: display.widthPx,
        };
        if (isScrollAnchoredSticker(display)) {
          patch.scrollAnchored = true;
          patch.offsetLeftPx = display.offsetLeftPx;
          patch.offsetTopPx = display.offsetTopPx;
        } else {
          patch.xPct = display.xPct;
          patch.yPct = display.yPct;
        }
        onUpdate(s.id, patch);
      }

      btn.addEventListener("pointermove", move);
      btn.addEventListener("pointerup", up);
      btn.addEventListener("pointercancel", up);
    },
    [display, onUpdate, s.id, setLive],
  );

  const startResize = useCallback(
    (e: ReactPointerEvent) => {
      if (e.button !== 0) {
        return;
      }
      e.stopPropagation();
      const btn = e.currentTarget as HTMLElement;
      btn.setPointerCapture(e.pointerId);
      const baseRot = display.rotationDeg;
      const baseWidth = display.widthPx;
      const { cx, cy } = stickerCenterViewport(display);
      let startR = Math.hypot(e.clientX - cx, e.clientY - cy);
      startR = Math.max(startR, baseWidth * 0.28, 24);

      function move(ev: PointerEvent) {
        const r = Math.hypot(ev.clientX - cx, ev.clientY - cy);
        const widthPx = clampWidthPx(baseWidth * (r / startR));
        setLive({
          ...display,
          widthPx,
        });
      }

      function up(ev: PointerEvent) {
        btn.releasePointerCapture(ev.pointerId);
        btn.removeEventListener("pointermove", move);
        btn.removeEventListener("pointerup", up);
        btn.removeEventListener("pointercancel", up);
        const r = Math.hypot(ev.clientX - cx, ev.clientY - cy);
        const widthPx = clampWidthPx(baseWidth * (r / startR));
        setLive(null);
        const patch: Parameters<Props["onUpdate"]>[1] = {
          widthPx,
          rotationDeg: baseRot,
        };
        if (isScrollAnchoredSticker(display)) {
          patch.scrollAnchored = true;
          patch.offsetLeftPx = display.offsetLeftPx;
          patch.offsetTopPx = display.offsetTopPx;
        } else {
          patch.xPct = display.xPct;
          patch.yPct = display.yPct;
        }
        onUpdate(s.id, patch);
      }

      btn.addEventListener("pointermove", move);
      btn.addEventListener("pointerup", up);
      btn.addEventListener("pointercancel", up);
    },
    [display, onUpdate, s.id, setLive],
  );

  function onStickerPointerDown(e: ReactPointerEvent) {
    const t = e.target as HTMLElement;
    if (t.closest("[data-sticker-rotate-handle]")) {
      return;
    }
    if (t.closest("[data-sticker-resize-handle]")) {
      return;
    }
    if (t.closest("button")) {
      return;
    }
    startMove(e);
  }

  return (
    <div
      data-sticker-root
      data-sticker-place-ignore
      className={cn(
        "group/sticker pointer-events-auto touch-none select-none",
        scroll ? "absolute" : "fixed",
        isActive && "z-80",
      )}
      style={
        scroll
          ? {
              left: display.offsetLeftPx,
              top: display.offsetTopPx,
              width: display.widthPx,
              transform: `translate(-50%, -50%) rotate(${display.rotationDeg}deg)`,
              zIndex: isActive ? 90 : 25,
            }
          : {
              left: `${display.xPct}vw`,
              top: `${display.yPct}vh`,
              width: display.widthPx,
              transform: `translate(-50%, -50%) rotate(${display.rotationDeg}deg)`,
              zIndex: isActive ? 90 : 25,
            }
      }
      onPointerDown={onStickerPointerDown}
    >
      <div className="relative drop-shadow-lg">
        <button
          type="button"
          data-sticker-rotate-handle
          data-sticker-place-ignore
          className={cn(
            "absolute left-1/2 top-0 z-20 flex size-6 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border border-border bg-background/95 text-muted-foreground shadow-md transition-opacity active:cursor-grabbing hover:bg-muted hover:text-foreground sm:size-7",
            "pointer-events-none opacity-0 group-hover/sticker:pointer-events-auto group-hover/sticker:opacity-100",
            isActive && "pointer-events-auto opacity-100",
          )}
          aria-label="Drag to spin sticker"
          onPointerDown={startRotate}
        >
          <RotateCw className="size-3.5" aria-hidden />
        </button>
        <button
          type="button"
          data-sticker-resize-handle
          data-sticker-place-ignore
          className={cn(
            "absolute -left-1 -top-1 z-20 flex size-6 cursor-nwse-resize items-center justify-center rounded-full border border-border bg-background/95 text-muted-foreground shadow-md transition-opacity active:cursor-nwse-resize hover:bg-muted hover:text-foreground sm:size-7",
            "pointer-events-none opacity-0 group-hover/sticker:pointer-events-auto group-hover/sticker:opacity-100",
            isActive && "pointer-events-auto opacity-100",
          )}
          aria-label="Drag to resize sticker"
          onPointerDown={startResize}
        >
          <Maximize2 className="size-3" aria-hidden />
        </button>
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className={cn(
            "absolute -right-1 -top-1 z-10 size-6 rounded-full border border-border bg-background/95 p-0 shadow-sm transition-opacity",
            "pointer-events-none opacity-0 group-hover/sticker:pointer-events-auto group-hover/sticker:opacity-100",
            isActive && "pointer-events-auto opacity-100",
          )}
          onClick={() => onRemove(s.id)}
          aria-label="Remove sticker"
          data-sticker-place-ignore
        >
          <X className="size-3.5" />
        </Button>
        {s.builtinId && isBuiltinId(s.builtinId) ? (
          <BuiltinStickerSvg
            id={s.builtinId}
            className="pointer-events-none size-full max-h-[min(20vh,200px)] w-auto"
          />
        ) : s.dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={s.dataUrl}
            alt=""
            className="pointer-events-none max-h-[min(22vh,220px)] w-auto max-w-[min(40vw,280px)] object-contain"
            draggable={false}
          />
        ) : s.stickerText && s.stickerShape ? (
          <div className="pointer-events-none w-full max-w-full">
            <TextStickerFace
              text={s.stickerText}
              shape={s.stickerShape}
              className="w-full max-w-full"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function UserPlacedStickersLayer({
  stickers,
  onRemove,
  onUpdate,
}: Props) {
  const pathname = usePathname();
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [live, setLive] = useState<PlacedStickerV1 | null>(null);

  useLayoutEffect(() => {
    const sync = () => {
      setMount(getStickerAnchorElement());
    };
    sync();
    const raf = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(raf);
  }, [pathname, stickers.length]);

  if (stickers.length === 0) {
    return null;
  }

  const layer = (
    <div
      className="pointer-events-none absolute inset-0 z-20 min-h-full w-full"
      aria-hidden={false}
    >
      {stickers.map((s) => {
        const display = live?.id === s.id ? live : s;
        return (
          <PlacedStickerItem
            key={s.id}
            sticker={s}
            display={display}
            isActive={live?.id === s.id}
            onRemove={onRemove}
            onUpdate={onUpdate}
            setLive={setLive}
          />
        );
      })}
    </div>
  );

  if (!mount) {
    return null;
  }

  return createPortal(layer, mount);
}
