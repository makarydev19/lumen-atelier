import { GrainRect, ShaftGradient, StudySvg, VGradient } from "../defs";
import type { StudyProps } from "../LightStudy";

/** §4.2 `alveolo` — courtyard opening, one-point perspective, olive tree. */
export function AlveoloStudy({ title, id }: StudyProps) {
  const patch = "260,760 560,760 620,940 200,940";
  const canopy: [number, number, number][] = [
    [405, 640, 60],
    [350, 670, 44],
    [462, 672, 48],
    [380, 600, 38],
    [440, 598, 34],
    [320, 625, 30],
    [495, 630, 32],
  ];
  return (
    <StudySvg title={title} variant="alveolo">
      <defs>
        <VGradient id={`${id}-wall`} from="#EDE3D4" to="#D8C6AE" />
        <VGradient id={`${id}-sky`} from="#FFFFFF" to="#F6EBDA" />
        <ShaftGradient id={`${id}-shaft`} />
      </defs>
      <rect width="800" height="1000" fill={`url(#${id}-wall)`} />
      {/* ceiling + side planes */}
      <polygon points="0,0 800,0 550,60 250,60" fill="#D9C9B2" />
      <polygon points="0,0 250,60 250,360 0,1000" fill="#E3D6C3" />
      <polygon points="800,0 550,60 550,360 800,1000" fill="#DCCDB7" />
      <polygon points="250,360 550,360 800,1000 0,1000" fill="#E6DAC8" />
      {/* opening */}
      <rect x="250" y="60" width="300" height="300" fill={`url(#${id}-sky)`} />
      <g stroke="#C7B49B" strokeWidth="2" fill="none">
        <rect x="250" y="60" width="300" height="300" />
        <path d="M250,60 L0,0 M550,60 L800,0 M250,360 L0,1000 M550,360 L800,1000" />
      </g>
      {/* light shaft from opening down to patch */}
      <polygon points="250,360 550,360 620,940 200,940" fill={`url(#${id}-shaft)`} opacity="0.28" />
      <g data-light-patch="">
        <polygon points={patch} fill="#FFF6E8" opacity="0.8" />
        <polygon points={patch} fill="#FFF6E8" opacity="0.5" filter="url(#soften)" />
      </g>
      {/* tree shadow */}
      <ellipse cx="420" cy="900" rx="130" ry="20" fill="#6F6B4E" opacity="0.25" filter="url(#soften-sm)" />
      {/* olive tree */}
      <path
        d="M402,905 C406,860 396,820 408,780 C414,758 404,730 396,700 M408,780 C424,756 440,730 450,700"
        fill="none"
        stroke="#4A3F33"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <g fill="#6F6B4E" opacity="0.8">
        {canopy.map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
        ))}
      </g>
      <GrainRect />
    </StudySvg>
  );
}
