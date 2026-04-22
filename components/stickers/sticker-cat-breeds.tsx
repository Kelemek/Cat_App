import type { SVGProps } from "react";

const VB = { w: 72, h: 72 };

function CatWhiskersAndMouth({
  strokeMuzzle,
  strokeSoft,
}: {
  strokeMuzzle: string;
  strokeSoft: string;
}) {
  return (
    <>
      <path
        d="M 31.6 52.3 Q 33.6 54.2 36 53.2 Q 38.4 54.2 40.4 52.3"
        fill="none"
        stroke={strokeMuzzle}
        strokeWidth="1.05"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 36 51.1 L 36 52.5"
        stroke={strokeMuzzle}
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.65"
      />
      <g stroke={strokeSoft} strokeWidth="1.15" strokeLinecap="round" fill="none">
        <path d="M 24 45 L 6 42" opacity="0.95" />
        <path d="M 24 47.5 L 5 47.5" opacity="0.95" />
        <path d="M 24 50 L 7 53" opacity="0.95" />
        <path d="M 48 45 L 66 42" opacity="0.95" />
        <path d="M 48 47.5 L 67 47.5" opacity="0.95" />
        <path d="M 48 50 L 65 53" opacity="0.95" />
      </g>
      <g
        stroke={strokeSoft}
        strokeWidth="0.75"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      >
        <path d="M 26 46 Q 16 44 9 45.5" />
        <path d="M 26 48.5 Q 15 48.5 8 49.5" />
        <path d="M 46 46 Q 56 44 63 45.5" />
        <path d="M 46 48.5 Q 57 48.5 64 49.5" />
      </g>
    </>
  );
}

/** Orange tabby — warm fur, M stripes, green eyes. */
export function StickerCatTabby(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <path
        d="M 27 18 L 15 3 L 7 21 Q 11 27 24 22 Z"
        fill="#e8a86a"
        stroke="#c97d3a"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M 21 20 L 16 9 L 12 20 Q 14 23 21 20 Z"
        fill="#ffb89c"
        opacity="0.9"
      />
      <path
        d="M 45 18 L 57 3 L 65 21 Q 61 27 48 22 Z"
        fill="#e8a86a"
        stroke="#c97d3a"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M 51 20 L 56 9 L 60 20 Q 58 23 51 20 Z"
        fill="#ffb89c"
        opacity="0.9"
      />
      <ellipse cx="36" cy="40" rx="28" ry="24" fill="#f0b078" stroke="#d48840" strokeWidth="1.5" />
      <ellipse cx="36" cy="44" rx="20" ry="16" fill="#fce5c8" />
      {/* Tabby stripes */}
      <g stroke="#b86420" strokeWidth="1.1" strokeLinecap="round" opacity="0.88">
        <path d="M 36 24 L 36 32" />
        <path d="M 30 26 Q 33 29 36 28 Q 39 29 42 26" fill="none" />
        <path d="M 22 36 Q 28 34 32 38" fill="none" />
        <path d="M 50 36 Q 44 34 40 38" fill="none" />
      </g>
      <ellipse cx="26" cy="34" rx="7" ry="9" fill="#c8e8d0" />
      <ellipse cx="46" cy="34" rx="7" ry="9" fill="#c8e8d0" />
      <ellipse cx="26" cy="35" rx="3" ry="5" fill="#2d4a28" />
      <ellipse cx="46" cy="35" rx="3" ry="5" fill="#2d4a28" />
      <ellipse cx="26" cy="33" rx="1.2" ry="1.8" fill="#fff" opacity="0.9" />
      <ellipse cx="46" cy="33" rx="1.2" ry="1.8" fill="#fff" opacity="0.9" />
      <path
        d="M 36 43.5 C 33.5 43.5 32 45.2 32 46.8 C 32 48.8 34.2 50.2 36 51.2 C 37.8 50.2 40 48.8 40 46.8 C 40 45.2 38.5 43.5 36 43.5 Z"
        fill="#e898b0"
        stroke="#c06078"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
      <ellipse cx="34.2" cy="45.8" rx="1.1" ry="0.75" fill="#fff" opacity="0.45" />
      <ellipse cx="34.3" cy="47.8" rx="0.9" ry="1.1" fill="#a84860" opacity="0.5" />
      <ellipse cx="37.7" cy="47.8" rx="0.9" ry="1.1" fill="#a84860" opacity="0.5" />
      <CatWhiskersAndMouth strokeMuzzle="#b05068" strokeSoft="#9a7860" />
    </svg>
  );
}

/** Tuxedo — black cap & ears, white muzzle. */
export function StickerCatTuxedo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <path
        d="M 27 18 L 15 3 L 7 21 Q 11 27 24 22 Z"
        fill="#2a2a32"
        stroke="#1a1a22"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M 21 20 L 16 9 L 12 20 Q 14 23 21 20 Z"
        fill="#ffb0c8"
        opacity="0.85"
      />
      <path
        d="M 45 18 L 57 3 L 65 21 Q 61 27 48 22 Z"
        fill="#2a2a32"
        stroke="#1a1a22"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M 51 20 L 56 9 L 60 20 Q 58 23 51 20 Z"
        fill="#ffb0c8"
        opacity="0.85"
      />
      <ellipse cx="36" cy="40" rx="28" ry="24" fill="#f6f4f2" stroke="#dcd8d4" strokeWidth="1.5" />
      <path
        d="M 14 30 Q 36 9 58 30 Q 52 24 36 21 Q 20 24 14 30 Z"
        fill="#2a2a32"
      />
      <ellipse cx="36" cy="46" rx="18" ry="14" fill="#faf8f6" />
      <ellipse cx="26" cy="34" rx="7" ry="9" fill="#ffe8c8" />
      <ellipse cx="46" cy="34" rx="7" ry="9" fill="#ffe8c8" />
      <ellipse cx="26" cy="35" rx="3" ry="5" fill="#1a1a22" />
      <ellipse cx="46" cy="35" rx="3" ry="5" fill="#1a1a22" />
      <ellipse cx="26" cy="33" rx="1.2" ry="1.8" fill="#fff" opacity="0.95" />
      <ellipse cx="46" cy="33" rx="1.2" ry="1.8" fill="#fff" opacity="0.95" />
      <path
        d="M 36 43.5 C 33.5 43.5 32 45.2 32 46.8 C 32 48.8 34.2 50.2 36 51.2 C 37.8 50.2 40 48.8 40 46.8 C 40 45.2 38.5 43.5 36 43.5 Z"
        fill="#f0a0b8"
        stroke="#c86888"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
      <ellipse cx="34.2" cy="45.8" rx="1.1" ry="0.75" fill="#fff" opacity="0.45" />
      <ellipse cx="34.3" cy="47.8" rx="0.9" ry="1.1" fill="#904860" opacity="0.45" />
      <ellipse cx="37.7" cy="47.8" rx="0.9" ry="1.1" fill="#904860" opacity="0.45" />
      <CatWhiskersAndMouth strokeMuzzle="#a84868" strokeSoft="#8a8880" />
    </svg>
  );
}

/** Siamese — cream coat, dark points, blue eyes. */
export function StickerCatSiamese(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <path
        d="M 27 18 L 15 3 L 7 21 Q 11 27 24 22 Z"
        fill="#5c4a42"
        stroke="#3d3028"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M 21 20 L 16 9 L 12 20 Q 14 23 21 20 Z"
        fill="#e8b8c8"
        opacity="0.75"
      />
      <path
        d="M 45 18 L 57 3 L 65 21 Q 61 27 48 22 Z"
        fill="#5c4a42"
        stroke="#3d3028"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M 51 20 L 56 9 L 60 20 Q 58 23 51 20 Z"
        fill="#e8b8c8"
        opacity="0.75"
      />
      <ellipse cx="36" cy="40" rx="28" ry="24" fill="#f0e0d4" stroke="#d8c8bc" strokeWidth="1.5" />
      <ellipse cx="36" cy="44" rx="20" ry="16" fill="#f5e8de" />
      {/* Point color: forehead + cheek shadows (eyes painted on top) */}
      <path
        d="M 18 38 Q 28 22 36 24 Q 44 22 54 38 Q 48 32 42 30 Q 36 28 30 30 Q 24 32 18 38 Z"
        fill="#4a3c38"
        opacity="0.88"
      />
      <ellipse cx="22" cy="40" rx="9" ry="11" fill="#4a3c38" opacity="0.55" />
      <ellipse cx="50" cy="40" rx="9" ry="11" fill="#4a3c38" opacity="0.55" />
      <ellipse cx="26" cy="34" rx="7" ry="9" fill="#8ecdf5" />
      <ellipse cx="46" cy="34" rx="7" ry="9" fill="#8ecdf5" />
      <ellipse cx="26" cy="35" rx="3" ry="5" fill="#1a3050" />
      <ellipse cx="46" cy="35" rx="3" ry="5" fill="#1a3050" />
      <ellipse cx="26" cy="33" rx="1.2" ry="1.8" fill="#fff" opacity="0.95" />
      <ellipse cx="46" cy="33" rx="1.2" ry="1.8" fill="#fff" opacity="0.95" />
      <path
        d="M 36 43.5 C 33.5 43.5 32 45.2 32 46.8 C 32 48.8 34.2 50.2 36 51.2 C 37.8 50.2 40 48.8 40 46.8 C 40 45.2 38.5 43.5 36 43.5 Z"
        fill="#c89098"
        stroke="#8a5860"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
      <ellipse cx="34.2" cy="45.8" rx="1.1" ry="0.75" fill="#fff" opacity="0.35" />
      <ellipse cx="34.3" cy="47.8" rx="0.9" ry="1.1" fill="#5a3840" opacity="0.55" />
      <ellipse cx="37.7" cy="47.8" rx="0.9" ry="1.1" fill="#5a3840" opacity="0.55" />
      <CatWhiskersAndMouth strokeMuzzle="#6a4850" strokeSoft="#7a7068" />
    </svg>
  );
}
