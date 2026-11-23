import { GrainRect, ShaftGradient, StudySvg, VGradient } from "../defs";
import type { StudyProps } from "../LightStudy";

/** §4.2 `ourse` — tall French window, light rhombus, long oak table. */
export function OurseStudy({ title, id }: StudyProps) {
  const patch = "260,820 760,880 760,1000 180,1000";
  return (
    <StudySvg title={title} variant="ourse">
      <defs>
        <VGradient id={`${id}-wall`} from="#F1E8DC" to="#DCCBB4" />
        <VGradient id={`${id}-floor`} from="#CDB89C" to="#BBA283" />
        <ShaftGradient id={`${id}-shaft`} x1={0} y1={0} x2={1} y2={0.4} />
      </defs>
      <rect width="800" height="1000" fill={`url(#${id}-wall)`} />
      <rect y="820" width="800" height="180" fill={`url(#${id}-floor)`} />
      {/* French window, 4 panes */}
      <rect x="52" y="112" width="216" height="716" fill="#E3D5C1" />
      <rect x="60" y="120" width="200" height="700" fill="#FFF5E6" />
      <g fill="#DCCBB4">
        <rect x="157" y="120" width="6" height="700" />
        <rect x="60" y="467" width="200" height="6" />
      </g>
      <g data-light-patch="">
        <polygon points={patch} fill={`url(#${id}-shaft)`} />
        <polygon points={patch} fill={`url(#${id}-shaft)`} opacity="0.5" filter="url(#soften)" />
      </g>
      {/* table */}
      <ellipse cx="480" cy="905" rx="250" ry="10" fill="#8B7155" opacity="0.3" filter="url(#soften-sm)" />
      <g fill="#9C6B43">
        <rect x="220" y="700" width="520" height="26" />
        <rect x="250" y="726" width="12" height="176" />
        <rect x="698" y="726" width="12" height="176" />
      </g>
      <path d="M520,676 A40,24 0 0 0 600,676 Z" fill="#B4532F" />
      <GrainRect />
    </StudySvg>
  );
}
