import {
  coalescePlacedMapFromRaw,
  isPlacedSticker,
  MAX_PLACED_STICKERS,
  parseCollectionItemsJson,
  PLACED_STICKERS_BY_PATH_KEY,
  PLACED_STICKERS_KEY,
  COLLECTION_KEY,
  type CollectionItemV1,
  type PlacedStickerV1,
} from "@/lib/stickers/user-storage";

function tryLegacyGlobalPlaced(): Record<string, PlacedStickerV1[]> {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = localStorage.getItem(PLACED_STICKERS_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return {};
    }
    const list = parsed.filter(isPlacedSticker).slice(0, MAX_PLACED_STICKERS);
    return list.length > 0 ? { "/": list } : {};
  } catch {
    return {};
  }
}

/**
 * Reads legacy browser localStorage sticker data for one-time import into Postgres.
 * Returns null if there is nothing to import.
 */
export function readLocalStickerSnapshotForDbImport(): {
  placedByPath: Record<string, PlacedStickerV1[]>;
  collection: CollectionItemV1[];
} | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const rawMap = localStorage.getItem(PLACED_STICKERS_BY_PATH_KEY);
    let placedByPath = coalescePlacedMapFromRaw(rawMap);
    if (Object.keys(placedByPath).length === 0) {
      placedByPath = tryLegacyGlobalPlaced();
    }
    const collection = parseCollectionItemsJson(localStorage.getItem(COLLECTION_KEY));
    if (Object.keys(placedByPath).length === 0 && collection.length === 0) {
      return null;
    }
    return { placedByPath, collection };
  } catch {
    return null;
  }
}

export function clearLocalStickerStorageAfterImport(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.removeItem(PLACED_STICKERS_BY_PATH_KEY);
    localStorage.removeItem(PLACED_STICKERS_KEY);
    localStorage.removeItem(COLLECTION_KEY);
  } catch {
    /* ignore */
  }
}
