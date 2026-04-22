"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { StickerDragGhost } from "@/components/stickers/sticker-drag-ghost";
import { StickerPlacementBanner } from "@/components/stickers/sticker-placement-banner";
import {
  commitStickerPlacementAtPoint,
  stickerPendingLabel,
  type PendingPlacement,
} from "@/components/stickers/sticker-placement-host";
import { StickerStudioModal } from "@/components/stickers/sticker-studio-modal";
import { UserPlacedStickersLayer } from "@/components/stickers/user-placed-stickers-layer";
import {
  getPlacedStickersSnapshotForPath,
  loadPlacedStickersForPath,
  normalizeStickerPathKey,
  PLACED_STICKERS_BY_PATH_KEY,
  savePlacedStickersForPath,
  STICKER_SCROLL_ROOT_ID,
  subscribePlaced,
  type PlacedStickerV1,
} from "@/lib/stickers/user-storage";

const DRAG_THRESHOLD_PX = 8;

type StickerContextValue = {
  studioOpen: boolean;
  setStudioOpen: (open: boolean) => void;
};

const StickerContext = createContext<StickerContextValue | null>(null);

export function useStickerOverlay() {
  const ctx = useContext(StickerContext);
  if (!ctx) {
    throw new Error("useStickerOverlay must be used within StickerProvider");
  }
  return ctx;
}

export function StickerProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const stickerPathKey = normalizeStickerPathKey(pathname);

  const placedStorageRaw = useSyncExternalStore(
    subscribePlaced,
    () => {
      if (typeof window === "undefined") {
        return "";
      }
      try {
        return localStorage.getItem(PLACED_STICKERS_BY_PATH_KEY) ?? "";
      } catch {
        return "";
      }
    },
    () => "",
  );

  const placedStickers = useMemo(
    () => getPlacedStickersSnapshotForPath(stickerPathKey),
    [placedStorageRaw, stickerPathKey],
  );

  const [studioOpen, setStudioOpen] = useState(false);
  const [activeDrag, setActiveDrag] = useState<{
    pending: PendingPlacement;
    x: number;
    y: number;
  } | null>(null);

  const detachWindowDragRef = useRef<(() => void) | null>(null);

  const onStudioStickerPointerDown = useCallback(
    (pending: PendingPlacement, e: React.PointerEvent) => {
      if (e.button !== 0) {
        return;
      }
      e.preventDefault();
      const pointerId = e.pointerId;
      const ox = e.clientX;
      const oy = e.clientY;

      const tracking = {
        pending,
        active: false,
      };

      const teardown = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
        window.removeEventListener("keydown", key);
        detachWindowDragRef.current = null;
      };

      const key = (ev: KeyboardEvent) => {
        if (ev.key === "Escape") {
          teardown();
          setActiveDrag(null);
        }
      };

      const move = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) {
          return;
        }
        if (!tracking.active) {
          if (
            Math.hypot(ev.clientX - ox, ev.clientY - oy) <
            DRAG_THRESHOLD_PX
          ) {
            return;
          }
          tracking.active = true;
          setStudioOpen(false);
          setActiveDrag({
            pending: tracking.pending,
            x: ev.clientX,
            y: ev.clientY,
          });
        } else {
          setActiveDrag((s) =>
            s ? { ...s, x: ev.clientX, y: ev.clientY } : s,
          );
        }
      };

      const end = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) {
          return;
        }
        teardown();
        if (tracking.active) {
          commitStickerPlacementAtPoint(
            stickerPathKey,
            tracking.pending,
            ev.clientX,
            ev.clientY,
          );
        }
        setActiveDrag(null);
      };

      detachWindowDragRef.current = teardown;
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
      window.addEventListener("keydown", key);
    },
    [stickerPathKey],
  );

  useEffect(() => {
    return () => {
      detachWindowDragRef.current?.();
    };
  }, []);

  const removePlaced = useCallback(
    (id: string) => {
      savePlacedStickersForPath(
        stickerPathKey,
        loadPlacedStickersForPath(stickerPathKey).filter((s) => s.id !== id),
      );
    },
    [stickerPathKey],
  );

  const updatePlaced = useCallback(
    (
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
    ) => {
      savePlacedStickersForPath(
        stickerPathKey,
        loadPlacedStickersForPath(stickerPathKey).map((s) =>
          s.id === id ? { ...s, ...patch } : s,
        ),
      );
    },
    [stickerPathKey],
  );

  const cancelDrag = useCallback(() => {
    detachWindowDragRef.current?.();
    setActiveDrag(null);
  }, []);

  const value = useMemo(
    () => ({
      studioOpen,
      setStudioOpen,
    }),
    [studioOpen],
  );

  return (
    <StickerContext.Provider value={value}>
      <StickerPlacementBanner
        active={activeDrag !== null}
        label={stickerPendingLabel()}
        onCancel={cancelDrag}
      />
      {activeDrag ? (
        <StickerDragGhost
          pending={activeDrag.pending}
          x={activeDrag.x}
          y={activeDrag.y}
        />
      ) : null}
      <StickerStudioModal
        open={studioOpen}
        onOpenChange={setStudioOpen}
        pagePathKey={stickerPathKey}
        onStickerDragPointerDown={onStudioStickerPointerDown}
        placedCount={placedStickers.length}
      />
      <div
        id={STICKER_SCROLL_ROOT_ID}
        className="relative z-10 flex min-h-full flex-1 flex-col"
      >
        {children}
      </div>
      <UserPlacedStickersLayer
        stickers={placedStickers}
        onRemove={removePlaced}
        onUpdate={updatePlaced}
      />
    </StickerContext.Provider>
  );
}
