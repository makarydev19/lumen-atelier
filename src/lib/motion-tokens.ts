/** Motion tokens mirroring DESIGN.md §2.6 (CSS vars live in globals.css). */
export const EASE = {
  out: [0.16, 1, 0.3, 1],
  outSoft: [0.22, 1, 0.36, 1],
  inOut: [0.87, 0, 0.13, 1],
  in: [0.7, 0, 0.84, 0],
} as const;

export const GSAP_EASE = {
  out: "expo.out",
  outSoft: "power3.out",
  inOut: "expo.inOut",
  in: "power3.in",
  scrub: "none",
} as const;

/** Durations in seconds. */
export const DUR = {
  instant: 0.12,
  fast: 0.24,
  base: 0.48,
  slow: 0.9,
  slower: 1.2,
  cinematic: 1.6,
} as const;

export const STAGGER = {
  lines: 0.08,
  words: 0.03,
  chars: 0.025,
  items: 0.1,
} as const;
