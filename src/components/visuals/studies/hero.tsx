import { GrainRect, ShaftGradient, StudySvg, VGradient } from "../defs";
import type { StudyProps } from "../LightStudy";

/** §4.1 "Morning arch" */
export function HeroStudy({ title, id }: StudyProps) {
  const arch = "M470,620 L470,290 A110,110 0 0 1 690,290 L690,620 Z";
  const floorPatch = "120,1000 380,1000 520,760 330,760";
  const wallPatch = "M180,760 L180,610 A90,90 0 0 1 360,610 L360,760 Z";
  const vessel =
    "M238,700 L272,700 L270,708 C268,716 270,724 278,732 C298,748 304,776 298,800 C292,824 282,840 274,850 L236,850 C228,840 218,824 212,800 C206,776 212,748 232,732 C240,724 242,716 240,708 Z";
  return (
    <StudySvg title={title} variant="hero">
      <defs>
        <VGradient id={`${id}-wall`} from="#EFE7DB" mid={["#E2D6C5", 0.6]} to="#CDBDA8" />
        <VGradient id={`${id}-floor`} from="#BFA88E" to="#A88F75" />
        <radialGradient id={`${id}-sky`} cx="0.5" cy="0.45" r="0.65">
          <stop offset="0" stopColor="#FFF8EC" />
          <stop offset="1" stopColor="#F6E3C6" />
        </radialGradient>
        <ShaftGradient id={`${id}-shaft`} />
        <ShaftGradient id={`${id}-shaft-diag`} x1={0.75} y1={0} x2={0.3} y2={1} />
        <VGradient id={`${id}-vessel`} from="#B4532F" to="#8E3F22" />
        <clipPath id={`${id}-window`}>
          <path d={arch} />
        </clipPath>
      </defs>

      {/* 1. wall + floor */}
      <rect width="800" height="1000" fill={`url(#${id}-wall)`} />
      <rect y="760" width="800" height="240" fill={`url(#${id}-floor)`} />
      <rect y="758" width="800" height="2" fill="#B7A189" opacity="0.6" />

      {/* 2. aperture */}
      <path d={arch} fill="none" stroke="#D9CBB7" strokeWidth="14" />
      <path d={arch} fill={`url(#${id}-sky)`} />
      <g clipPath={`url(#${id}-window)`} fill="#CDBDA8">
        <rect x="577" y="170" width="6" height="460" />
        <rect x="460" y="427" width="240" height="6" />
      </g>

      {/* 3. cast light (sharp + blurred duplicate) */}
      <g data-light-patch="">
        <polygon points={floorPatch} fill={`url(#${id}-shaft)`} />
        <path d={wallPatch} fill={`url(#${id}-shaft)`} />
        <g filter="url(#soften)" opacity="0.5">
          <polygon points={floorPatch} fill={`url(#${id}-shaft)`} />
          <path d={wallPatch} fill={`url(#${id}-shaft)`} />
        </g>
      </g>

      {/* 4. cast mullion shadows */}
      <g fill="#B79E84" opacity="0.35" filter="url(#soften-sm)">
        <polygon points="246,1000 256,1000 428,760 421,760" />
        <polygon points="225,877 450,877 446,885 221,885" />
        <rect x="267" y="520" width="6" height="240" />
        <rect x="180" y="637" width="180" height="6" />
      </g>

      {/* 5. accent vessel */}
      <ellipse cx="255" cy="852" rx="52" ry="8" fill="#8E7660" opacity="0.35" filter="url(#soften-sm)" />
      <path d={vessel} fill={`url(#${id}-vessel)`} />
      <path d="M226,752 C217,774 217,798 224,818" fill="none" stroke="#D9A07F" strokeWidth="1" />

      {/* atmosphere shaft (ANIM: rotates around 580,240 with pointer) */}
      <g data-shaft="" style={{ transformOrigin: "580px 240px" }}>
        <polygon
          points="470,240 690,240 380,1000 120,1000"
          fill={`url(#${id}-shaft-diag)`}
          opacity="0.25"
          style={{ mixBlendMode: "screen" }}
        />
      </g>

      {/* 6. grain */}
      <GrainRect />
    </StudySvg>
  );
}
