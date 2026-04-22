import type { ComponentType, SVGProps } from "react";
import {
  StickerCatSiamese,
  StickerCatTabby,
  StickerCatTuxedo,
} from "@/components/stickers/sticker-cat-breeds";
import {
  StickerArrowLeft,
  StickerArrowRight,
  StickerFishbone,
  StickerHeartEars,
  StickerPaw,
  StickerRagdollFace,
  StickerYarn,
} from "@/components/stickers/sticker-art";

export type BuiltinStickerId =
  | "paw"
  | "face"
  | "heart"
  | "yarn"
  | "fishbone"
  | "tabby"
  | "tuxedo"
  | "siamese"
  | "arrow-left"
  | "arrow-right";

export type BuiltinStickerDef = {
  id: BuiltinStickerId;
  label: string;
  Component: ComponentType<SVGProps<SVGSVGElement>>;
};

export const BUILTIN_STICKERS: BuiltinStickerDef[] = [
  { id: "paw", label: "Paw", Component: StickerPaw },
  { id: "face", label: "Ragdoll", Component: StickerRagdollFace },
  { id: "tabby", label: "Orange tabby", Component: StickerCatTabby },
  { id: "tuxedo", label: "Tuxedo", Component: StickerCatTuxedo },
  { id: "siamese", label: "Siamese", Component: StickerCatSiamese },
  { id: "heart", label: "Heart", Component: StickerHeartEars },
  { id: "yarn", label: "Yarn", Component: StickerYarn },
  { id: "fishbone", label: "Feather toy", Component: StickerFishbone },
  { id: "arrow-left", label: "Left arrow", Component: StickerArrowLeft },
  { id: "arrow-right", label: "Right arrow", Component: StickerArrowRight },
];

const BUILTIN_MAP = Object.fromEntries(
  BUILTIN_STICKERS.map((b) => [b.id, b.Component]),
) as Record<BuiltinStickerId, BuiltinStickerDef["Component"]>;

export function BuiltinStickerSvg({
  id,
  className,
}: {
  id: BuiltinStickerId;
  className?: string;
}) {
  const C = BUILTIN_MAP[id];
  if (!C) {
    return null;
  }
  return <C className={className} />;
}

export function isBuiltinId(s: string): s is BuiltinStickerId {
  return s in BUILTIN_MAP;
}
