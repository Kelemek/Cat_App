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
} from "react";
import {
  addPlacedStickerAction,
  addStickerCollectionItemAction,
  clearPlacedStickersForPathAction,
  deletePlacedStickerAction,
  getStickerDbCountsAction,
  importLocalStickerSnapshotAction,
  listPlacedStickersForPathAction,
  listStickerCollectionAction,
  removeStickerCollectionItemAction,
  updatePlacedStickerAction,
} from "@/app/actions/stickers";
import { StickerDragGhost } from "@/components/stickers/sticker-drag-ghost";
import { StickerPlacementBanner } from "@/components/stickers/sticker-placement-banner";
import {
  buildPlacedStickerAtPoint,
  stickerPendingLabel,
  type PendingPlacement,
} from "@/components/stickers/sticker-placement-host";
import { StickerStudioModal } from "@/components/stickers/sticker-studio-modal";
import { UserPlacedStickersLayer } from "@/components/stickers/user-placed-stickers-layer";
import { readLocalStickerSnapshotForDbImport, clearLocalStickerStorageAfterImport } from "@/lib/stickers/migrate-local-storage";
import {
  normalizeStickerPathKey,
  STICKER_SCROLL_ROOT_ID,
  type CollectionItemV1,
  type PlacedStickerV1,
} from "@/lib/stickers/user-storage";

const DRAG_THRESHOLD_PX = 8;

function isLoginPathKey(pathKey: string): boolean {
  return pathKey === "/login";
}

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
  const stickersDisabled = isLoginPathKey(stickerPathKey);

  const [placedStickers, setPlacedStickers] = useState<PlacedStickerV1[]>([]);
  const [collection, setCollection] = useState<CollectionItemV1[]>([]);
  const importAttemptedRef = useRef(false);

  const refreshPlacedOnly = useCallback(async () => {
    if (stickersDisabled) {
      return;
    }
    try {
      const placed = await listPlacedStickersForPathAction(stickerPathKey);
      setPlacedStickers(placed);
    } catch {
      setPlacedStickers([]);
    }
  }, [stickerPathKey, stickersDisabled]);

  const refreshAll = useCallback(async () => {
    if (stickersDisabled) {
      setPlacedStickers([]);
      setCollection([]);
      return;
    }
    try {
      const [placed, coll] = await Promise.all([
        listPlacedStickersForPathAction(stickerPathKey),
        listStickerCollectionAction(),
      ]);
      setPlacedStickers(placed);
      setCollection(coll);
    } catch {
      setPlacedStickers([]);
      setCollection([]);
    }
  }, [stickerPathKey, stickersDisabled]);

  useEffect(() => {
    if (stickersDisabled) {
      setPlacedStickers([]);
      setCollection([]);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const [placed, coll] = await Promise.all([
          listPlacedStickersForPathAction(stickerPathKey),
          listStickerCollectionAction(),
        ]);
        if (cancelled) {
          return;
        }
        setPlacedStickers(placed);
        setCollection(coll);

        if (!importAttemptedRef.current) {
          importAttemptedRef.current = true;
          try {
            const counts = await getStickerDbCountsAction();
            if (counts.placed === 0 && counts.collection === 0) {
              const snap = readLocalStickerSnapshotForDbImport();
              if (snap) {
                await importLocalStickerSnapshotAction(snap);
                clearLocalStickerStorageAfterImport();
                const [p2, c2] = await Promise.all([
                  listPlacedStickersForPathAction(stickerPathKey),
                  listStickerCollectionAction(),
                ]);
                if (!cancelled) {
                  setPlacedStickers(p2);
                  setCollection(c2);
                }
              }
            }
          } catch {
            /* migration is best-effort */
          }
        }
      } catch {
        if (!cancelled) {
          setPlacedStickers([]);
          setCollection([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [stickerPathKey, stickersDisabled]);

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
          const built = buildPlacedStickerAtPoint(
            tracking.pending,
            ev.clientX,
            ev.clientY,
          );
          if (built) {
            void (async () => {
              try {
                await addPlacedStickerAction(built, stickerPathKey);
                await refreshPlacedOnly();
              } catch (err) {
                console.error(err);
              }
            })();
          }
        }
        setActiveDrag(null);
      };

      detachWindowDragRef.current = teardown;
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
      window.addEventListener("keydown", key);
    },
    [stickerPathKey, refreshPlacedOnly],
  );

  useEffect(() => {
    return () => {
      detachWindowDragRef.current?.();
    };
  }, []);

  const removePlaced = useCallback(
    (id: string) => {
      void (async () => {
        try {
          await deletePlacedStickerAction(id);
          await refreshPlacedOnly();
        } catch (err) {
          console.error(err);
        }
      })();
    },
    [refreshPlacedOnly],
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
      void (async () => {
        try {
          await updatePlacedStickerAction(id, patch);
          await refreshPlacedOnly();
        } catch (err) {
          console.error(err);
        }
      })();
    },
    [refreshPlacedOnly],
  );

  const cancelDrag = useCallback(() => {
    detachWindowDragRef.current?.();
    setActiveDrag(null);
  }, []);

  const clearPlacedForCurrentPath = useCallback(() => {
    void (async () => {
      try {
        await clearPlacedStickersForPathAction(stickerPathKey);
        await refreshPlacedOnly();
      } catch (err) {
        console.error(err);
      }
    })();
  }, [stickerPathKey, refreshPlacedOnly]);

  const removeCollectionItem = useCallback(
    (id: string) => {
      void (async () => {
        try {
          await removeStickerCollectionItemAction(id);
          await refreshAll();
        } catch (err) {
          console.error(err);
        }
      })();
    },
    [refreshAll],
  );

  const addCollectionItem = useCallback(
    (item: CollectionItemV1) => {
      void (async () => {
        try {
          await addStickerCollectionItemAction(item);
          await refreshAll();
        } catch (err) {
          console.error(err);
        }
      })();
    },
    [refreshAll],
  );

  useEffect(() => {
    if (stickersDisabled) {
      setStudioOpen(false);
      cancelDrag();
    }
  }, [stickersDisabled, cancelDrag]);

  const value = useMemo(
    () => ({
      studioOpen,
      setStudioOpen,
    }),
    [studioOpen],
  );

  return (
    <StickerContext.Provider value={value}>
      {!stickersDisabled ? (
        <>
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
            onStickerDragPointerDown={onStudioStickerPointerDown}
            placedCount={placedStickers.length}
            collection={collection}
            onClearPlaced={clearPlacedForCurrentPath}
            onRemoveCollectionItem={removeCollectionItem}
            onAddCollectionItem={addCollectionItem}
          />
        </>
      ) : null}
      <div
        id={STICKER_SCROLL_ROOT_ID}
        className="relative z-10 flex min-h-full flex-1 flex-col"
      >
        {children}
      </div>
      {!stickersDisabled ? (
        <UserPlacedStickersLayer
          stickers={placedStickers}
          onRemove={removePlaced}
          onUpdate={updatePlaced}
        />
      ) : null}
    </StickerContext.Provider>
  );
}
