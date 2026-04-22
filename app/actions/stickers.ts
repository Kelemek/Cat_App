"use server";

import { requireSiteSession } from "@/lib/auth/require-site-session";
import * as db from "@/lib/data/stickers";
import {
  normalizeStickerPathKey,
  type CollectionItemV1,
  type PlacedStickerV1,
} from "@/lib/stickers/user-storage";

export async function listPlacedStickersForPathAction(
  pathKey: string,
): Promise<PlacedStickerV1[]> {
  await requireSiteSession();
  return db.dbListPlacedForPath(normalizeStickerPathKey(pathKey));
}

export async function addPlacedStickerAction(
  sticker: PlacedStickerV1,
  pathKey: string,
): Promise<void> {
  await requireSiteSession();
  await db.dbInsertPlaced(normalizeStickerPathKey(pathKey), sticker);
}

export async function deletePlacedStickerAction(id: string): Promise<void> {
  await requireSiteSession();
  await db.dbDeletePlaced(id);
}

export async function updatePlacedStickerAction(
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
): Promise<void> {
  await requireSiteSession();
  await db.dbPatchPlaced(id, patch);
}

export async function clearPlacedStickersForPathAction(pathKey: string): Promise<void> {
  await requireSiteSession();
  await db.dbClearPath(normalizeStickerPathKey(pathKey));
}

export async function listStickerCollectionAction(): Promise<CollectionItemV1[]> {
  await requireSiteSession();
  return db.dbListCollection();
}

export async function addStickerCollectionItemAction(
  item: CollectionItemV1,
): Promise<void> {
  await requireSiteSession();
  await db.dbInsertCollectionItem(item);
}

export async function removeStickerCollectionItemAction(id: string): Promise<void> {
  await requireSiteSession();
  await db.dbDeleteCollectionItem(id);
}

export async function getStickerDbCountsAction(): Promise<{
  placed: number;
  collection: number;
}> {
  await requireSiteSession();
  return db.dbStickerRowCounts();
}

export async function importLocalStickerSnapshotAction(snapshot: {
  placedByPath: Record<string, PlacedStickerV1[]>;
  collection: CollectionItemV1[];
}): Promise<void> {
  await requireSiteSession();
  const normalized: Record<string, PlacedStickerV1[]> = {};
  for (const [k, v] of Object.entries(snapshot.placedByPath)) {
    normalized[normalizeStickerPathKey(k)] = v;
  }
  await db.dbBulkImportFromLocalSnapshot({
    placedByPath: normalized,
    collection: snapshot.collection,
  });
}
