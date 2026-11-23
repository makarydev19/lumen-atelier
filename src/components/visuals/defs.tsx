import type { ReactNode } from "react";

/**
 * Shared SVG primitives (DESIGN.md §4.0).
 * Filters (#grain, #soften, #soften-sm, #haze) are rendered once by <Grain/> in the layout
 * and referenced by every study. Gradients are per-SVG with a prefixed id.
 */

export function ShaftGradient({
  id,
  x1 = 0,
  y1 = 0,
  x2 = 0,
  y2 = 1,
}: {
  id: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}) {
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
      <stop offset="0" stopColor="#FFF6E8" stopOpacity="0.95" />
      <stop offset="0.55" stopColor="#FFE9CF" stopOpacity="0.6" />
      <stop offset="1" stopColor="#F3EEE6" stopOpacity="0" />
    </linearGradient>
  );
}

export function VGradient({ id, from, to, mid }: { id: string; from: string; to: string; mid?: [string, number] }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={from} />
      {mid && <stop offset={mid[1]} stopColor={mid[0]} />}
      <stop offset="1" stopColor={to} />
    </linearGradient>
  );
}

/** Final grain layer — every LightStudy ends with this. */
export function GrainRect({ width = 800, height = 1000 }: { width?: number; height?: number }) {
  return (
    <rect
      width={width}
      height={height}
      filter="url(#grain)"
      style={{ mixBlendMode: "multiply" }}
      data-grain=""
    />
  );
}

/** Root <svg> for a 4:5 light study. */
export function StudySvg({
  title,
  variant,
  children,
}: {
  title: string;
  variant: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={title}
      data-study={variant}
      width="100%"
      height="100%"
    >
      {children}
    </svg>
  );
}
