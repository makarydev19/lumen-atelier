/**
 * Swappable media slots (DESIGN.md §4).
 * Swap any entry to `{ kind: "image", src: "/images/alveolo.jpg", alt, width, height }`
 * and <MediaFrame> renders next/image instead of the SVG light study.
 */
export type LightStudyVariant =
  | "hero"
  | "beam"
  | "alveolo"
  | "salt"
  | "halde"
  | "ourse"
  | "vesterbro";

export type Media =
  | { kind: "svg"; variant: LightStudyVariant; alt: string }
  | { kind: "process"; alt: string }
  | { kind: "image"; src: string; alt: string; width: number; height: number };

export const media = {
  hero: {
    kind: "svg",
    variant: "hero",
    alt: "Illustration: morning light falling through an arched window onto a plaster wall and a terracotta vessel",
  },
  beam: {
    kind: "svg",
    variant: "beam",
    alt: "Illustration: a single beam of light from a high circular oculus landing on a plaster floor",
  },
  alveolo: {
    kind: "svg",
    variant: "alveolo",
    alt: "Illustration: a square courtyard opening casting a patch of light around an old olive tree",
  },
  salt: {
    kind: "svg",
    variant: "salt",
    alt: "Illustration: a long rooflight washing the back wall of a reading room lined with bookshelves",
  },
  halde: {
    kind: "svg",
    variant: "halde",
    alt: "Illustration: a dark granite bathhouse with a letterbox window over the fjord reflected in a steaming pool",
  },
  ourse: {
    kind: "svg",
    variant: "ourse",
    alt: "Illustration: a tall French window throwing light across an apartment floor towards a long oak table",
  },
  vesterbro: {
    kind: "svg",
    variant: "vesterbro",
    alt: "Illustration: a sawtooth north-light roof over an artist's studio with an easel and a terracotta canvas",
  },
  process: {
    kind: "process",
    alt: "Line drawing in four layers: site contours and sun path, a floor plan, four material swatches, and a house section with a shaft of light",
  },
} satisfies Record<string, Media>;

export type MediaKey = keyof typeof media;
