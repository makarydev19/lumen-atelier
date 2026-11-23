import { ShaftGradient } from "./defs";

/**
 * §4.3 ProcessVisual — one SVG, four stroke layers (viewBox 0 0 720 880).
 * Each layer is `g[data-layer="listen|draw|choose|build"]` (+ `data-layer-index`).
 * Stroke paths carry pathLength="1" so ANIM can tween stroke-dashoffset 1 → 0.
 * Filled shapes carry `data-fill` (ANIM: autoAlpha + scale).
 */

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Smooth closed contour through irregular radial points (Catmull-Rom → cubic Bézier). */
function contour(cx: number, cy: number, r: number, k: number): string {
  const n = 14;
  const pts: [number, number][] = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (1 + 0.075 * Math.sin(3 * a + k * 0.9) + 0.045 * Math.cos(5 * a + k * 1.7));
    return [cx + rr * Math.cos(a), cy + rr * 0.86 * Math.sin(a)];
  });
  let d = `M${r1(pts[0][0])},${r1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${r1(c1x)},${r1(c1y)} ${r1(c2x)},${r1(c2y)} ${r1(p2[0])},${r1(p2[1])}`;
  }
  return d + " Z";
}

const CONTOURS = Array.from({ length: 9 }, (_, k) => contour(360, 520, 60 + k * 35, k));

const SWATCHES = [
  { x: 180, fill: "#D8CBB4", label: "TRAVERTINE" },
  { x: 300, fill: "#A87A4F", label: "OAK" },
  { x: 420, fill: "#EEE9DF", label: "LIME", stroke: true },
  { x: 540, fill: "#B8955A", label: "BRASS" },
];

const LAYERS = ["listen", "draw", "choose", "build"] as const;

function layerOpacity(index: number, mode: "progressive" | "composite", activeStep: number): number {
  const step = index + 1;
  if (mode === "composite") return step === 4 ? 1 : 0.4;
  if (step > activeStep) return 0;
  return step === activeStep ? 1 : 0.25;
}

export function ProcessVisual({
  activeStep = 4,
  mode,
  idPrefix,
  title,
}: {
  activeStep?: number;
  mode: "progressive" | "composite";
  idPrefix: string;
  title: string;
}) {
  const stroke = {
    fill: "none",
    stroke: "#1C1A18",
    strokeWidth: 1.5,
    vectorEffect: "non-scaling-stroke" as const,
    pathLength: 1,
  };
  const op = (i: number) => layerOpacity(i, mode, activeStep);

  return (
    <svg
      viewBox="0 0 720 880"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={title}
      width="100%"
      height="100%"
      data-process-visual=""
      data-mode={mode}
      data-active-step={activeStep}
    >
      <defs>
        <ShaftGradient id={`${idPrefix}-shaft`} x1={0.7} y1={0} x2={0.3} y2={1} />
      </defs>
      <rect width="720" height="880" fill="#E7DFD2" />

      {/* 1. Listen — site contours + sun path */}
      <g data-layer={LAYERS[0]} data-layer-index="1" opacity={op(0)}>
        {CONTOURS.map((d, i) => (
          <path key={i} d={d} {...stroke} strokeOpacity={0.55 + i * 0.04} />
        ))}
        <path
          d="M60,300 Q360,-120 660,300"
          fill="none"
          stroke="#1C1A18"
          strokeWidth={1.5}
          strokeDasharray="4 6"
          vectorEffect="non-scaling-stroke"
          data-sunpath=""
        />
        <circle cx="360" cy="90" r="14" fill="#B4532F" data-fill="" />
      </g>

      {/* 2. Draw — floor plan */}
      <g data-layer={LAYERS[1]} data-layer-index="2" opacity={op(1)}>
        <path
          d="M150,400 H210 M270,400 H440 M500,400 H570 V560 M570,620 V700 H420 M360,700 H150 V560 M150,500 V400"
          {...stroke}
        />
        <path d="M330,400 V620 M330,670 V700 M150,560 H260 M310,560 H330 M470,600 V700 M330,600 H420" {...stroke} />
        <path d="M330,620 H380 A50,50 0 0 1 330,670" {...stroke} />
        <path d="M260,560 V510 A50,50 0 0 1 310,560" {...stroke} />
        <rect x="420" y="450" width="100" height="100" {...stroke} />
        <rect x="200" y="460" width="80" height="40" {...stroke} />
      </g>

      {/* 3. Choose — material swatches */}
      <g data-layer={LAYERS[2]} data-layer-index="3" opacity={op(2)}>
        {SWATCHES.map((s) => (
          <g key={s.label}>
            <circle
              cx={s.x}
              cy="760"
              r="54"
              fill={s.fill}
              stroke={s.stroke ? "#1C1A18" : "none"}
              strokeWidth={s.stroke ? 1 : 0}
              vectorEffect="non-scaling-stroke"
              data-fill=""
            />
            <text
              x={s.x}
              y="850"
              textAnchor="middle"
              fill="#1C1A18"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 11, letterSpacing: "0.14em" }}
            >
              {s.label}
            </text>
          </g>
        ))}
      </g>

      {/* 4. Build — section elevation + light shaft onto the table */}
      <g data-layer={LAYERS[3]} data-layer-index="4" opacity={op(3)}>
        <polygon points="418,112 458,134 282,500 200,500" fill={`url(#${idPrefix}-shaft)`} data-fill="" />
        <path d="M120,380 H600 M200,380 V170 M520,380 V170 M200,275 H520" {...stroke} />
        <path d="M170,190 L360,62 L408,94 M466,133 L550,190" {...stroke} />
        <path d="M408,94 L466,133" fill="none" stroke="#B4532F" strokeWidth={1.5} vectorEffect="non-scaling-stroke" pathLength={1} />
      </g>
    </svg>
  );
}
