import type { SVGProps } from "react";

/** Cute ragdoll-themed decorative SVGs (pastels, floof, blue eyes). */

export function StickerPaw(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <ellipse cx="32" cy="55.5" rx="19" ry="4.5" fill="#e8a8bc" opacity="0.28" />
      {/* Four plump toe beans */}
      <g stroke="#d898ac" strokeWidth="0.75" strokeLinejoin="round">
        <ellipse
          cx="15.5"
          cy="23.5"
          rx="5"
          ry="7.2"
          fill="#ffd6e2"
          transform="rotate(-22 15.5 23.5)"
        />
        <ellipse
          cx="25"
          cy="14.8"
          rx="4.8"
          ry="6.8"
          fill="#ffd6e2"
          transform="rotate(-8 25 14.8)"
        />
        <ellipse
          cx="39"
          cy="14.8"
          rx="4.8"
          ry="6.8"
          fill="#ffd6e2"
          transform="rotate(8 39 14.8)"
        />
        <ellipse
          cx="48.5"
          cy="23.5"
          rx="5"
          ry="7.2"
          fill="#ffd6e2"
          transform="rotate(22 48.5 23.5)"
        />
      </g>
      <ellipse cx="14.5" cy="21.5" rx="2.2" ry="1.6" fill="#fff8fa" opacity="0.95" />
      <ellipse cx="24.5" cy="13.2" rx="2" ry="1.45" fill="#fff8fa" opacity="0.95" />
      <ellipse cx="39.5" cy="13.2" rx="2" ry="1.45" fill="#fff8fa" opacity="0.95" />
      <ellipse cx="49.5" cy="21.5" rx="2.2" ry="1.6" fill="#fff8fa" opacity="0.95" />
      <ellipse cx="15.8" cy="25.5" rx="1.35" ry="1.1" fill="#ffb0c8" opacity="0.55" />
      <ellipse cx="25.2" cy="17.5" rx="1.25" ry="1" fill="#ffb0c8" opacity="0.55" />
      <ellipse cx="38.8" cy="17.5" rx="1.25" ry="1" fill="#ffb0c8" opacity="0.55" />
      <ellipse cx="48.2" cy="25.5" rx="1.35" ry="1.1" fill="#ffb0c8" opacity="0.55" />
      {/* Main pad — soft pillowy heart-ish sole */}
      <path
        d="M 32 53.5
          C 23.5 53.5 17.8 48.2 17.2 41.5
          C 16.8 36.5 19.5 32.2 23.8 30.2
          C 24.8 28.5 26.2 27.2 28 26.5
          C 29.2 25.2 30.5 25.8 31.2 27.2
          C 31.6 26 32.4 25.3 33.2 26.2
          C 34.8 25.8 36 26.5 36.8 27.8
          C 38.5 27.2 40 28.5 41 30.2
          C 45.2 32.2 47.8 36.5 47.5 41.5
          C 46.8 48.2 41 53.5 32 53.5 Z"
        fill="#ffe0ea"
        stroke="#d898ac"
        strokeWidth="1.05"
        strokeLinejoin="round"
      />
      <path
        d="M 32 51 C 25 51 20 47 19.5 41.5 C 21 44 26 46 32 46 C 38 46 43 44 44.5 41.5 C 44 47 39 51 32 51 Z"
        fill="#ffc8d8"
        opacity="0.65"
      />
      <ellipse cx="32" cy="33" rx="10" ry="7" fill="#fff5f8" opacity="0.5" />
      <path
        d="M 24 38 Q 28 41 32 40 Q 36 41 40 38"
        stroke="#e8a0bf"
        strokeWidth="0.85"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
      <ellipse cx="26" cy="44" rx="2.8" ry="2.2" fill="#ffb8cc" opacity="0.5" />
      <ellipse cx="38" cy="44" rx="2.8" ry="2.2" fill="#ffb8cc" opacity="0.5" />
    </svg>
  );
}

export function StickerRagdollFace(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      {/* Cat ears — behind face */}
      <path
        d="M 27 18 L 15 3 L 7 21 Q 11 27 24 22 Z"
        fill="#f8f4f0"
        stroke="#e8dfd6"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M 21 20 L 16 9 L 12 20 Q 14 23 21 20 Z"
        fill="#ffc8d8"
        opacity="0.88"
      />
      <path
        d="M 45 18 L 57 3 L 65 21 Q 61 27 48 22 Z"
        fill="#f8f4f0"
        stroke="#e8dfd6"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M 51 20 L 56 9 L 60 20 Q 58 23 51 20 Z"
        fill="#ffc8d8"
        opacity="0.88"
      />
      <ellipse cx="36" cy="40" rx="28" ry="24" fill="#f8f4f0" stroke="#e8dfd6" strokeWidth="1.5" />
      <ellipse cx="36" cy="44" rx="20" ry="16" fill="#fdfcfa" />
      <ellipse cx="26" cy="34" rx="7" ry="9" fill="#8ecdf5" />
      <ellipse cx="46" cy="34" rx="7" ry="9" fill="#8ecdf5" />
      <ellipse cx="26" cy="35" rx="3" ry="5" fill="#1a3a52" />
      <ellipse cx="46" cy="35" rx="3" ry="5" fill="#1a3a52" />
      <ellipse cx="26" cy="33" rx="1.2" ry="1.8" fill="#fff" opacity="0.9" />
      <ellipse cx="46" cy="33" rx="1.2" ry="1.8" fill="#fff" opacity="0.9" />
      {/* Cat nose — soft heart-ish pad */}
      <path
        d="M 36 43.5 C 33.5 43.5 32 45.2 32 46.8 C 32 48.8 34.2 50.2 36 51.2 C 37.8 50.2 40 48.8 40 46.8 C 40 45.2 38.5 43.5 36 43.5 Z"
        fill="#e898b0"
        stroke="#d07890"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
      <ellipse cx="34.2" cy="45.8" rx="1.1" ry="0.75" fill="#fff" opacity="0.45" />
      {/* Nostrils */}
      <ellipse cx="34.3" cy="47.8" rx="0.9" ry="1.1" fill="#c06880" opacity="0.55" />
      <ellipse cx="37.7" cy="47.8" rx="0.9" ry="1.1" fill="#c06880" opacity="0.55" />
      {/* Mouth — soft W under the nose */}
      <path
        d="M 31.6 52.3 Q 33.6 54.2 36 53.2 Q 38.4 54.2 40.4 52.3"
        fill="none"
        stroke="#d07890"
        strokeWidth="1.05"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 36 51.1 L 36 52.5"
        stroke="#d07890"
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.65"
      />
      {/* Whiskers — fan from muzzle */}
      <g stroke="#a89888" strokeWidth="1.15" strokeLinecap="round" fill="none">
        <path d="M 24 45 L 6 42" opacity="0.95" />
        <path d="M 24 47.5 L 5 47.5" opacity="0.95" />
        <path d="M 24 50 L 7 53" opacity="0.95" />
        <path d="M 48 45 L 66 42" opacity="0.95" />
        <path d="M 48 47.5 L 67 47.5" opacity="0.95" />
        <path d="M 48 50 L 65 53" opacity="0.95" />
      </g>
      <g stroke="#c4b8a8" strokeWidth="0.75" strokeLinecap="round" fill="none" opacity="0.85">
        <path d="M 26 46 Q 16 44 9 45.5" />
        <path d="M 26 48.5 Q 15 48.5 8 49.5" />
        <path d="M 46 46 Q 56 44 63 45.5" />
        <path d="M 46 48.5 Q 57 48.5 64 49.5" />
      </g>
    </svg>
  );
}

export function StickerHeartEars(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <path
        d="M28 48 C10 36 4 24 14 16 C20 10 26 14 28 20 C30 14 36 10 42 16 C52 24 46 36 28 48Z"
        fill="#ff9eb5"
        opacity="0.9"
      />
      <path
        d="M28 44 C14 34 10 24 18 18 C22 15 26 18 28 22 C30 18 34 15 38 18 C46 24 42 34 28 44Z"
        fill="#ffc2d1"
        opacity="0.85"
      />
    </svg>
  );
}

export { StickerYarn } from "@/components/stickers/sticker-yarn";

export function StickerFishbone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      {/* Wand handle */}
      <path
        d="M 6 30 L 34 30"
        stroke="#9a7b6a"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M 6 30.9 L 34 30.9"
        stroke="#7d5e4e"
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.25"
      />
      {/* Collar where feathers bundle */}
      <ellipse cx="36" cy="30" rx="3.2" ry="3.4" fill="#c9a08a" />
      <ellipse cx="36.4" cy="29.2" rx="1.4" ry="1.5" fill="#e8d0c4" opacity="0.7" />
      {/* Feather plumes — fan from bundle */}
      <path
        d="M 37 29 Q 46 14 54 8 Q 50 18 42 28 Z"
        fill="#ffc2d1"
        stroke="#e898a8"
        strokeWidth="0.65"
        strokeLinejoin="round"
      />
      <path
        d="M 37 30 Q 50 16 58 14 Q 52 24 44 30 Z"
        fill="#ffb3c6"
        stroke="#e08098"
        strokeWidth="0.55"
        strokeLinejoin="round"
        opacity="0.95"
      />
      <path
        d="M 37 31 Q 48 26 56 28 Q 50 34 41 32 Z"
        fill="#ffcad8"
        stroke="#e8a0b0"
        strokeWidth="0.5"
        strokeLinejoin="round"
        opacity="0.92"
      />
      <path
        d="M 37 29 Q 44 22 50 20 Q 46 28 40 30 Z"
        fill="#fff5f8"
        opacity="0.75"
      />
      <path
        d="M 37 30 Q 42 12 46 10 Q 44 22 39 29 Z"
        fill="#ffaec0"
        opacity="0.55"
      />
      <path
        d="M 38 31 Q 54 30 60 32 Q 52 36 42 33 Z"
        fill="#f0a8b8"
        stroke="#d87890"
        strokeWidth="0.45"
        strokeLinejoin="round"
        opacity="0.88"
      />
      {/* Center fluff */}
      <ellipse cx="39" cy="29.5" rx="4" ry="3.5" fill="#ffd0dc" opacity="0.55" />
      <ellipse cx="40" cy="28.5" rx="2" ry="2.2" fill="#fff" opacity="0.35" />
    </svg>
  );
}

/** Rounded “chubby” direction arrow — pastel periwinkle to match sticker set. */
export function StickerArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <ellipse cx="34" cy="54" rx="17" ry="4" fill="#8ca8d8" opacity="0.22" />
      <path
        d="M 16 26 L 36 26 L 36 17 L 54 32 L 36 47 L 36 38 L 16 38 Z"
        fill="#c8d8f8"
        stroke="#6a82b8"
        strokeWidth="1.65"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M 20 29 L 34 29 L 34 22.5 L 47 32 L 34 41.5 L 34 35 L 20 35 Z"
        fill="#eef4ff"
        opacity="0.55"
      />
    </svg>
  );
}

export function StickerArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <ellipse cx="30" cy="54" rx="17" ry="4" fill="#8ca8d8" opacity="0.22" />
      <path
        d="M 48 26 L 28 26 L 28 17 L 10 32 L 28 47 L 28 38 L 48 38 Z"
        fill="#c8d8f8"
        stroke="#6a82b8"
        strokeWidth="1.65"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M 44 29 L 30 29 L 30 22.5 L 17 32 L 30 41.5 L 30 35 L 44 35 Z"
        fill="#eef4ff"
        opacity="0.55"
      />
    </svg>
  );
}
