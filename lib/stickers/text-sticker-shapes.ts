export const TEXT_STICKER_SHAPE_IDS = [
  "bubble",
  "star",
  "cloud",
  "ribbon",
  "sparkle",
  "arrow-left",
  "arrow-right",
] as const;

export type TextStickerShapeId = (typeof TEXT_STICKER_SHAPE_IDS)[number];

export const TEXT_STICKER_SHAPES: ReadonlyArray<{
  id: TextStickerShapeId;
  label: string;
}> = [
  { id: "bubble", label: "Bubble" },
  { id: "star", label: "Star" },
  { id: "cloud", label: "Cloud" },
  { id: "ribbon", label: "Ribbon" },
  { id: "sparkle", label: "Gem" },
  { id: "arrow-left", label: "Left arrow" },
  { id: "arrow-right", label: "Right arrow" },
];

export function isTextStickerShape(x: string): x is TextStickerShapeId {
  return (TEXT_STICKER_SHAPE_IDS as readonly string[]).includes(x);
}

/** Stored in localStorage; enforced on save and validation. */
export const MAX_STICKER_TEXT_CHARS = 80;
