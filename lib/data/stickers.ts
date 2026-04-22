import { createAdminClient } from "@/lib/supabase/admin";
import {
  isCollectionItem,
  isPlacedSticker,
  MAX_COLLECTION_ITEMS,
  MAX_DATA_URL_LENGTH,
  MAX_PLACED_STICKERS,
  type CollectionItemV1,
  type PlacedStickerV1,
} from "@/lib/stickers/user-storage";

export async function dbListPlacedForPath(pathKey: string): Promise<PlacedStickerV1[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("sticker_placed")
    .select("data")
    .eq("path_key", pathKey)
    .order("created_at", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  const out: PlacedStickerV1[] = [];
  for (const row of data ?? []) {
    if (row?.data && isPlacedSticker(row.data)) {
      out.push(row.data as PlacedStickerV1);
    }
  }
  return out.slice(0, MAX_PLACED_STICKERS);
}

export async function dbGetPlacedById(id: string): Promise<PlacedStickerV1 | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("sticker_placed")
    .select("data")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  if (!data?.data || !isPlacedSticker(data.data)) {
    return null;
  }
  return data.data as PlacedStickerV1;
}

export async function dbInsertPlaced(pathKey: string, sticker: PlacedStickerV1): Promise<void> {
  if (!isPlacedSticker(sticker)) {
    throw new Error("Invalid sticker.");
  }
  const supabase = createAdminClient();
  const { count, error: cErr } = await supabase
    .from("sticker_placed")
    .select("*", { count: "exact", head: true })
    .eq("path_key", pathKey);
  if (cErr) {
    throw new Error(cErr.message);
  }
  if ((count ?? 0) >= MAX_PLACED_STICKERS) {
    throw new Error("Too many stickers on this page.");
  }
  const { error } = await supabase.from("sticker_placed").insert({
    id: sticker.id,
    path_key: pathKey,
    data: sticker,
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function dbDeletePlaced(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("sticker_placed").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function dbUpdatePlacedRow(id: string, sticker: PlacedStickerV1): Promise<void> {
  if (!isPlacedSticker(sticker)) {
    throw new Error("Invalid sticker.");
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("sticker_placed")
    .update({
      data: sticker,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function dbPatchPlaced(
  id: string,
  patch: Partial<PlacedStickerV1>,
): Promise<void> {
  const existing = await dbGetPlacedById(id);
  if (!existing) {
    throw new Error("Sticker not found.");
  }
  const next = { ...existing, ...patch, id: existing.id };
  if (!isPlacedSticker(next)) {
    throw new Error("Invalid sticker.");
  }
  await dbUpdatePlacedRow(id, next);
}

export async function dbClearPath(pathKey: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("sticker_placed").delete().eq("path_key", pathKey);
  if (error) {
    throw new Error(error.message);
  }
}

export async function dbListCollection(): Promise<CollectionItemV1[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("sticker_collection_item")
    .select("id, name, data_url, created_at_ms")
    .order("sort_order", { ascending: true })
    .order("created_at_ms", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  const out: CollectionItemV1[] = [];
  for (const row of data ?? []) {
    if (
      row &&
      typeof row.id === "string" &&
      typeof row.name === "string" &&
      typeof row.data_url === "string" &&
      typeof row.created_at_ms === "number"
    ) {
      out.push({
        id: row.id,
        name: row.name,
        dataUrl: row.data_url,
        createdAt: row.created_at_ms,
      });
    }
  }
  return out.slice(0, MAX_COLLECTION_ITEMS);
}

export async function dbInsertCollectionItem(item: CollectionItemV1): Promise<void> {
  if (!isCollectionItem(item)) {
    throw new Error("Invalid collection item.");
  }
  if (item.dataUrl.length > MAX_DATA_URL_LENGTH) {
    throw new Error("Image too large.");
  }
  const supabase = createAdminClient();
  const { count, error: cErr } = await supabase
    .from("sticker_collection_item")
    .select("*", { count: "exact", head: true });
  if (cErr) {
    throw new Error(cErr.message);
  }
  if ((count ?? 0) >= MAX_COLLECTION_ITEMS) {
    throw new Error("Collection full.");
  }
  const { data: maxRow } = await supabase
    .from("sticker_collection_item")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sortOrder = (maxRow?.sort_order ?? 0) + 1;
  const { error } = await supabase.from("sticker_collection_item").insert({
    id: item.id,
    name: item.name,
    data_url: item.dataUrl,
    created_at_ms: item.createdAt,
    sort_order: sortOrder,
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function dbDeleteCollectionItem(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("sticker_collection_item").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function dbStickerRowCounts(): Promise<{ placed: number; collection: number }> {
  const supabase = createAdminClient();
  const [p, c] = await Promise.all([
    supabase.from("sticker_placed").select("*", { count: "exact", head: true }),
    supabase.from("sticker_collection_item").select("*", { count: "exact", head: true }),
  ]);
  if (p.error) {
    throw new Error(p.error.message);
  }
  if (c.error) {
    throw new Error(c.error.message);
  }
  return { placed: p.count ?? 0, collection: c.count ?? 0 };
}

export async function dbBulkImportFromLocalSnapshot(args: {
  placedByPath: Record<string, PlacedStickerV1[]>;
  collection: CollectionItemV1[];
}): Promise<void> {
  const supabase = createAdminClient();
  for (const [pathKey, list] of Object.entries(args.placedByPath)) {
    const trimmed = list.filter(isPlacedSticker).slice(0, MAX_PLACED_STICKERS);
    for (const s of trimmed) {
      const { error } = await supabase.from("sticker_placed").upsert(
        {
          id: s.id,
          path_key: pathKey,
          data: s,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );
      if (error) {
        throw new Error(error.message);
      }
    }
  }
  const { data: maxRow } = await supabase
    .from("sticker_collection_item")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  let sortBase = maxRow?.sort_order ?? 0;
  const coll = args.collection
    .filter(isCollectionItem)
    .filter((c) => c.dataUrl.length <= MAX_DATA_URL_LENGTH)
    .slice(0, MAX_COLLECTION_ITEMS);
  for (let i = 0; i < coll.length; i++) {
    const item = coll[i];
    sortBase += 1;
    const { error } = await supabase.from("sticker_collection_item").upsert(
      {
        id: item.id,
        name: item.name,
        data_url: item.dataUrl,
        created_at_ms: item.createdAt,
        sort_order: sortBase,
      },
      { onConflict: "id" },
    );
    if (error) {
      throw new Error(error.message);
    }
  }
}
