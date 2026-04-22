import type { TextStickerShapeId } from "@/lib/stickers/text-sticker-shapes";
import {
  isTextStickerShape,
  MAX_STICKER_TEXT_CHARS,
} from "@/lib/stickers/text-sticker-shapes";

/** Legacy: single global list (migrated into `PLACED_STICKERS_BY_PATH_KEY` under `/`). */
export const PLACED_STICKERS_KEY = "ragdoll-placed-stickers-v1";
/** `Record<pathKey, PlacedStickerV1[]>` — pathKey from `normalizeStickerPathKey`. */
export const PLACED_STICKERS_BY_PATH_KEY = "ragdoll-placed-stickers-by-path-v1";
export const COLLECTION_KEY = "ragdoll-sticker-collection-v1";
export const PLACED_EVENT = "ragdoll-placed-stickers-changed";
export const COLLECTION_EVENT = "ragdoll-sticker-collection-changed";

export const MAX_COLLECTION_ITEMS = 24;
export const MAX_PLACED_STICKERS = 60;
/** ~330KB base64 — keeps localStorage usable */
export const MAX_DATA_URL_LENGTH = 450_000;

/** Layout wrapper from StickerProvider (flex column for the app). */
export const STICKER_SCROLL_ROOT_ID = "sticker-scroll-root";

/**
 * Main content region below the header (`relative`). Scroll-anchored sticker
 * offsets are relative to this node so stickers stack above cards/background.
 */
export const STICKER_PLACEMENT_PLANE_ID = "sticker-placement-plane";

/** Stable route key for sticker storage (pathname only, no query). */
export function normalizeStickerPathKey(pathname: string | null | undefined): string {
  if (!pathname || pathname === "") {
    return "/";
  }
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1) || "/";
  }
  return pathname;
}

export function getStickerAnchorElement(): HTMLElement | null {
  if (typeof document === "undefined") {
    return null;
  }
  return (
    document.getElementById(STICKER_PLACEMENT_PLANE_ID) ??
    document.getElementById(STICKER_SCROLL_ROOT_ID)
  );
}

export type PlacedStickerV1 = {
  id: string;
  builtinId?: string;
  dataUrl?: string;
  /** Cute text sticker (no image). */
  stickerText?: string;
  stickerShape?: TextStickerShapeId;
  xPct: number;
  yPct: number;
  widthPx: number;
  rotationDeg: number;
  /** When true, offsets are the sticker center inside `#sticker-placement-plane` (or scroll root fallback). */
  scrollAnchored?: boolean;
  offsetLeftPx?: number;
  offsetTopPx?: number;
};

export function isScrollAnchoredSticker(
  s: PlacedStickerV1,
): s is PlacedStickerV1 & {
  scrollAnchored: true;
  offsetLeftPx: number;
  offsetTopPx: number;
} {
  return (
    s.scrollAnchored === true &&
    typeof s.offsetLeftPx === "number" &&
    typeof s.offsetTopPx === "number"
  );
}

export type CollectionItemV1 = {
  id: string;
  dataUrl: string;
  name: string;
  createdAt: number;
};

/** Stable empty snapshots for `useSyncExternalStore` (same ref until data changes). */
export const PLACED_SNAPSHOT_EMPTY: PlacedStickerV1[] = [];
export const COLLECTION_SNAPSHOT_EMPTY: CollectionItemV1[] = [];

let placedByPathCache: {
  raw: string | null;
  map: Record<string, PlacedStickerV1[]>;
} | null = null;

let collectionSnapshotCache: {
  raw: string | null;
  list: CollectionItemV1[];
} | null = null;

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function isPlacedSticker(x: unknown): x is PlacedStickerV1 {
  if (!x || typeof x !== "object") {
    return false;
  }
  const o = x as Record<string, unknown>;
  const hasImage =
    typeof o.builtinId === "string" ||
    (typeof o.dataUrl === "string" && o.dataUrl.length > 0);
  const hasTextSticker =
    typeof o.stickerText === "string" &&
    o.stickerText.trim().length > 0 &&
    o.stickerText.length <= MAX_STICKER_TEXT_CHARS + 40 &&
    typeof o.stickerShape === "string" &&
    isTextStickerShape(o.stickerShape);
  const base =
    typeof o.id === "string" &&
    typeof o.xPct === "number" &&
    typeof o.yPct === "number" &&
    typeof o.widthPx === "number" &&
    typeof o.rotationDeg === "number" &&
    (hasImage || hasTextSticker);
  if (!base) {
    return false;
  }
  if (o.scrollAnchored === true) {
    return typeof o.offsetLeftPx === "number" && typeof o.offsetTopPx === "number";
  }
  return true;
}

function isCollectionItem(x: unknown): x is CollectionItemV1 {
  if (!x || typeof x !== "object") {
    return false;
  }
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.dataUrl === "string" &&
    typeof o.name === "string" &&
    typeof o.createdAt === "number"
  );
}

function readLegacyPlacedList(): PlacedStickerV1[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(PLACED_STICKERS_KEY);
  } catch {
    return [];
  }
  const parsed = safeJsonParse<unknown[]>(raw);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.filter(isPlacedSticker).slice(0, MAX_PLACED_STICKERS);
}

function persistPlacedMap(map: Record<string, PlacedStickerV1[]>) {
  localStorage.setItem(PLACED_STICKERS_BY_PATH_KEY, JSON.stringify(map));
}

function coalescePlacedMapFromRaw(raw: string | null): Record<string, PlacedStickerV1[]> {
  if (!raw) {
    return {};
  }
  const parsed = safeJsonParse<unknown>(raw);
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const map: Record<string, PlacedStickerV1[]> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (Array.isArray(v)) {
        const list = v.filter(isPlacedSticker).slice(0, MAX_PLACED_STICKERS);
        if (list.length > 0) {
          const nk = normalizeStickerPathKey(k);
          map[nk] = list;
        }
      }
    }
    return map;
  }
  if (Array.isArray(parsed)) {
    const list = parsed.filter(isPlacedSticker).slice(0, MAX_PLACED_STICKERS);
    return list.length > 0 ? { "/": list } : {};
  }
  return {};
}

function refreshPlacedByPathCache(): void {
  if (typeof window === "undefined") {
    return;
  }
  let raw: string | null;
  try {
    raw = localStorage.getItem(PLACED_STICKERS_BY_PATH_KEY);
  } catch {
    placedByPathCache = { raw: null, map: {} };
    return;
  }

  if (!raw) {
    const legacy = readLegacyPlacedList();
    if (legacy.length > 0) {
      const map: Record<string, PlacedStickerV1[]> = {
        [normalizeStickerPathKey("/")]: legacy,
      };
      try {
        persistPlacedMap(map);
        localStorage.removeItem(PLACED_STICKERS_KEY);
        window.dispatchEvent(new Event(PLACED_EVENT));
      } catch {
        /* ignore */
      }
      try {
        raw = localStorage.getItem(PLACED_STICKERS_BY_PATH_KEY);
      } catch {
        raw = null;
      }
    }
  }

  const map = coalescePlacedMapFromRaw(raw);
  placedByPathCache = { raw, map };
}

/**
 * Snapshot for `useSyncExternalStore`: same array reference while storage is
 * unchanged for this path.
 */
export function getPlacedStickersSnapshotForPath(pathKey: string): PlacedStickerV1[] {
  if (typeof window === "undefined") {
    return PLACED_SNAPSHOT_EMPTY;
  }
  let raw: string | null;
  try {
    raw = localStorage.getItem(PLACED_STICKERS_BY_PATH_KEY);
  } catch {
    return PLACED_SNAPSHOT_EMPTY;
  }
  if (!placedByPathCache || placedByPathCache.raw !== raw) {
    refreshPlacedByPathCache();
  }
  const list = placedByPathCache?.map[pathKey];
  if (!list || list.length === 0) {
    return PLACED_SNAPSHOT_EMPTY;
  }
  return list;
}

export function loadPlacedStickersForPath(pathKey: string): PlacedStickerV1[] {
  return getPlacedStickersSnapshotForPath(pathKey);
}

export function savePlacedStickersForPath(
  pathKey: string,
  items: PlacedStickerV1[],
) {
  if (typeof window === "undefined") {
    return;
  }
  let raw: string | null;
  try {
    raw = localStorage.getItem(PLACED_STICKERS_BY_PATH_KEY);
  } catch {
    return;
  }
  if (!placedByPathCache || placedByPathCache.raw !== raw) {
    refreshPlacedByPathCache();
  }
  const base = placedByPathCache?.map ?? {};
  const trimmed = items.slice(0, MAX_PLACED_STICKERS);
  const next: Record<string, PlacedStickerV1[]> = { ...base };
  if (trimmed.length === 0) {
    delete next[pathKey];
  } else {
    next[pathKey] = trimmed;
  }
  try {
    persistPlacedMap(next);
    raw = localStorage.getItem(PLACED_STICKERS_BY_PATH_KEY);
    placedByPathCache = { raw, map: next };
    window.dispatchEvent(new Event(PLACED_EVENT));
  } catch {
    /* ignore */
  }
}

export function getCollectionSnapshot(): CollectionItemV1[] {
  if (typeof window === "undefined") {
    return COLLECTION_SNAPSHOT_EMPTY;
  }
  let raw: string | null;
  try {
    raw = localStorage.getItem(COLLECTION_KEY);
  } catch {
    return COLLECTION_SNAPSHOT_EMPTY;
  }
  if (collectionSnapshotCache?.raw === raw) {
    return collectionSnapshotCache.list;
  }
  const parsed = safeJsonParse<unknown[]>(raw);
  if (!Array.isArray(parsed)) {
    collectionSnapshotCache = { raw, list: COLLECTION_SNAPSHOT_EMPTY };
    return COLLECTION_SNAPSHOT_EMPTY;
  }
  const list = parsed.filter(isCollectionItem).slice(0, MAX_COLLECTION_ITEMS);
  const stable = list.length === 0 ? COLLECTION_SNAPSHOT_EMPTY : list;
  collectionSnapshotCache = { raw, list: stable };
  return stable;
}

export function loadCollection(): CollectionItemV1[] {
  return getCollectionSnapshot();
}

export function saveCollection(items: CollectionItemV1[]) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(
    COLLECTION_KEY,
    JSON.stringify(items.slice(0, MAX_COLLECTION_ITEMS)),
  );
  window.dispatchEvent(new Event(COLLECTION_EVENT));
}

export function subscribePlaced(onChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  const run = () => onChange();
  window.addEventListener(PLACED_EVENT, run);
  window.addEventListener("storage", run);
  return () => {
    window.removeEventListener(PLACED_EVENT, run);
    window.removeEventListener("storage", run);
  };
}

export function subscribeCollection(onChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  const run = () => onChange();
  window.addEventListener(COLLECTION_EVENT, run);
  window.addEventListener("storage", run);
  return () => {
    window.removeEventListener(COLLECTION_EVENT, run);
    window.removeEventListener("storage", run);
  };
}

export function newStickerId(): string {
  return crypto.randomUUID();
}
