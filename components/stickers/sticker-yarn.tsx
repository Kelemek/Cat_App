"use client";

import { useId, type SVGProps } from "react";

/** Ball of yarn — soft kawaii palette, blush cheeks, sparkly accents. */
export function StickerYarn(props: SVGProps<SVGSVGElement>) {
  const uid = useId().replace(/:/g, "");
  const clipId = `yarn-ball-clip-${uid}`;
  const gradId = `yarn-ball-grad-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <defs>
        <radialGradient id={gradId} cx="34%" cy="26%" r="74%">
          <stop offset="0%" stopColor="#fffafb" />
          <stop offset="28%" stopColor="#ffe4ee" />
          <stop offset="55%" stopColor="#ffc8dc" />
          <stop offset="82%" stopColor="#f5a0bc" />
          <stop offset="100%" stopColor="#e888a8" />
        </radialGradient>
        <clipPath id={clipId}>
          <circle cx="32" cy="32" r="18" />
        </clipPath>
      </defs>

      <ellipse cx="32" cy="52" rx="14" ry="3.5" fill="#e8a0b8" opacity="0.22" />

      <g clipPath={`url(#${clipId})`}>
        <circle cx="32" cy="32" r="18.5" fill={`url(#${gradId})`} />
        <ellipse
          cx="27"
          cy="28"
          rx="9"
          ry="7.5"
          fill="#fff"
          opacity="0.42"
        />
        <ellipse
          cx="32"
          cy="37"
          rx="13"
          ry="10"
          fill="#f07898"
          opacity="0.12"
        />
        {/* Rosy cheek fluff */}
        <ellipse cx="22" cy="36" rx="4.5" ry="3.2" fill="#ff9eb8" opacity="0.38" />
        <ellipse cx="42" cy="36" rx="4.5" ry="3.2" fill="#ff9eb8" opacity="0.38" />
        <g
          fill="none"
          strokeLinecap="round"
          stroke="#e07898"
          strokeWidth="1.25"
          opacity="0.88"
        >
          <ellipse cx="32" cy="32" rx="7.5" ry="16.5" />
        </g>
        <g
          fill="none"
          strokeLinecap="round"
          stroke="#d8688c"
          strokeWidth="1.05"
          opacity="0.78"
          transform="rotate(60 32 32)"
        >
          <ellipse cx="32" cy="32" rx="7.5" ry="16.5" />
        </g>
        <g
          fill="none"
          strokeLinecap="round"
          stroke="#d8688c"
          strokeWidth="1.05"
          opacity="0.78"
          transform="rotate(-60 32 32)"
        >
          <ellipse cx="32" cy="32" rx="7.5" ry="16.5" />
        </g>
        <g
          fill="none"
          strokeLinecap="round"
          stroke="#f090b0"
          strokeWidth="0.65"
          opacity="0.48"
          transform="rotate(30 32 32)"
        >
          <ellipse cx="32" cy="32" rx="5.5" ry="14" />
        </g>
        <g
          fill="none"
          strokeLinecap="round"
          stroke="#f090b0"
          strokeWidth="0.65"
          opacity="0.48"
          transform="rotate(-30 32 32)"
        >
          <ellipse cx="32" cy="32" rx="5.5" ry="14" />
        </g>
      </g>

      <circle
        cx="32"
        cy="32"
        r="18"
        fill="none"
        stroke="#f0a0b8"
        strokeWidth="1.1"
        opacity="0.9"
      />

      {/* Tiny sparkles */}
      <g fill="#fff" opacity="0.85">
        <circle cx="48" cy="14" r="1.2" />
        <circle cx="52" cy="20" r="0.85" />
        <circle cx="14" cy="22" r="0.9" />
      </g>
      <path
        d="M 47 16 L 49 16 M 48 15 L 48 17"
        stroke="#fff"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Curly loose strand */}
      <path
        d="M 38.5 43.5 C 41.5 44.5 43.5 47 44.2 50 C 45 53.5 44.2 57 41.5 59 C 39.5 60.5 36.8 60.5 35.2 58.8"
        stroke="#d06080"
        strokeWidth="1.35"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 39.5 45.5 C 41.8 47 43 49.5 43.5 52"
        stroke="#f0a8c0"
        strokeWidth="0.75"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      <circle cx="34.8" cy="59" r="2.2" fill="#ffc8dc" stroke="#e888a8" strokeWidth="0.55" />
      <ellipse
        cx="34.2"
        cy="58.3"
        rx="0.9"
        ry="0.55"
        fill="#fff"
        opacity="0.65"
      />
    </svg>
  );
}
