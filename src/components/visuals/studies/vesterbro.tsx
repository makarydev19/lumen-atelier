import { GrainRect, ShaftGradient, StudySvg, VGradient } from "../defs";
import type { StudyProps } from "../LightStudy";

/** §4.2 `vesterbro` — sawtooth north-light roof, easel with terracotta canvas. */
export function VesterbroStudy({ title, id }: StudyProps) {
  const teeth = [0, 1, 2, 3];
  return (
    <StudySvg title={title} variant="vesterbro">
      <defs>
        <VGradient id={`${id}-wall`} from="#E4E1DA" to="#C9C3B8" />
        <VGradient id={`${id}-floor`} from="#C2BBAF" to="#ADA597" />
        <ShaftGradient id={`${id}-shaft`} x1={0.6} y1={0} x2={0.3} y2={1} />
      </defs>
      <rect width="800" height="1000" fill={`url(#${id}-wall)`} />
      <rect y="700" width="800" height="300" fill={`url(#${id}-floor)`} />
      {/* sawtooth roof */}
      {teeth.map((i) => (
        <g key={i}>
          <polygon points={`${200 * i},140 ${200 * i + 170},10 ${200 * i + 170},140`} fill="#B7AFA3" />
          <polygon
            points={`${200 * i + 170},10 ${200 * i + 200},0 ${200 * i + 200},140 ${200 * i + 170},140`}
            fill="#F7F8F6"
          />
        </g>
      ))}
      <rect y="140" width="800" height="4" fill="#A79E91" />
      {/* light bands */}
      <g data-light-patch="" opacity="0.4">
        {teeth.map((i) => (
          <polygon
            key={i}
            points={`${120 + 200 * i},700 ${190 + 200 * i},700 ${90 + 200 * i},1000 ${-10 + 200 * i},1000`}
            fill={`url(#${id}-shaft)`}
            filter="url(#soften-sm)"
          />
        ))}
      </g>
      {/* easel */}
      <g stroke="#3A332C" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M520,560 L465,905" />
        <path d="M520,560 L575,905" />
        <path d="M520,590 L528,925" />
        <path d="M470,704 L570,704" />
      </g>
      <rect x="480" y="600" width="80" height="100" fill="#B4532F" />
      <GrainRect />
    </StudySvg>
  );
}
