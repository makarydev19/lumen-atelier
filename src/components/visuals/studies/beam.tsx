import { GrainRect, ShaftGradient, StudySvg, VGradient } from "../defs";
import type { StudyProps } from "../LightStudy";

/** §4.2 `beam` — high oculus, single narrow beam. */
export function BeamStudy({ title, id }: StudyProps) {
  const beam = "530,175 590,175 460,880 300,880";
  return (
    <StudySvg title={title} variant="beam">
      <defs>
        <VGradient id={`${id}-wall`} from="#EFE7DB" to="#D6C7B3" />
        <VGradient id={`${id}-floor`} from="#CDBBA3" to="#B9A388" />
        <ShaftGradient id={`${id}-shaft`} x1={0.8} y1={0} x2={0.4} y2={1} />
        <radialGradient id={`${id}-pool`}>
          <stop offset="0" stopColor="#FFF6E8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFE9CF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="1000" fill={`url(#${id}-wall)`} />
      <rect y="820" width="800" height="180" fill={`url(#${id}-floor)`} />
      <circle cx="560" cy="160" r="58" fill="#DCCDB8" />
      <circle cx="560" cy="160" r="50" fill="#FFF8EC" />
      <g data-light-patch="">
        <polygon points={beam} fill={`url(#${id}-shaft)`} opacity="0.85" />
        <polygon points={beam} fill={`url(#${id}-shaft)`} opacity="0.5" filter="url(#soften)" />
        <ellipse cx="380" cy="880" rx="120" ry="30" fill={`url(#${id}-pool)`} />
        <ellipse cx="380" cy="880" rx="120" ry="30" fill={`url(#${id}-pool)`} opacity="0.5" filter="url(#soften)" />
      </g>
      <GrainRect />
    </StudySvg>
  );
}
