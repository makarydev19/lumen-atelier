import { GrainRect, StudySvg, VGradient } from "../defs";
import type { StudyProps } from "../LightStudy";

/** §4.2 `halde` — dark granite, letterbox fjord window, steaming pool. */
export function HaldeStudy({ title, id }: StudyProps) {
  const ripples: [number, number, number][] = [
    [400, 760, 0.6],
    [380, 805, 0.45],
    [420, 852, 0.5],
    [395, 905, 0.35],
    [410, 958, 0.3],
  ];
  const rx = [320, 260, 300, 220, 200];
  return (
    <StudySvg title={title} variant="halde">
      <defs>
        <VGradient id={`${id}-wall`} from="#3A3A3D" to="#1F2023" />
        <VGradient id={`${id}-sky`} from="#DCE3E6" to="#9FB0B8" />
      </defs>
      <rect width="800" height="1000" fill={`url(#${id}-wall)`} />
      <rect x="50" y="300" width="700" height="120" fill={`url(#${id}-sky)`} />
      <rect x="50" y="300" width="700" height="120" fill="#DCE3E6" opacity="0.25" filter="url(#soften)" />
      <rect y="720" width="800" height="280" fill="#2E3236" />
      <g data-light-patch="" fill="#C9D3D8">
        {ripples.map(([cx, cy, o], i) => (
          <ellipse key={cy} cx={cx} cy={cy} rx={rx[i]} ry="3" opacity={o} />
        ))}
      </g>
      <rect y="719" width="800" height="2" fill="#D9A07F" />
      <g fill="#FFFFFF" opacity="0.15" filter="url(#haze)">
        <ellipse cx="260" cy="690" rx="160" ry="40" />
        <ellipse cx="480" cy="660" rx="200" ry="46" />
        <ellipse cx="640" cy="700" rx="140" ry="34" />
      </g>
      <GrainRect />
    </StudySvg>
  );
}
