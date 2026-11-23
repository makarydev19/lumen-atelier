import { GrainRect, ShaftGradient, StudySvg, VGradient } from "../defs";
import type { StudyProps } from "../LightStudy";

/** §4.2 `salt` — long rooflight slot washing the back wall, bookshelves. */
export function SaltStudy({ title, id }: StudyProps) {
  const shelves = [560, 640, 720, 800, 880, 960];
  // Muted book spines (x, height) per shelf, deterministic.
  const books = shelves.slice(1).flatMap((y, si) =>
    Array.from({ length: 14 }, (_, i) => {
      const x = 70 + i * 48 + ((si * 17) % 23);
      const h = 52 + ((i * 13 + si * 7) % 22);
      return { x, y, h, w: 10 + ((i + si) % 3) * 3, key: `${si}-${i}` };
    }),
  );
  return (
    <StudySvg title={title} variant="salt">
      <defs>
        <VGradient id={`${id}-wall`} from="#E9E6E1" to="#BDB7AE" />
        <ShaftGradient id={`${id}-shaft`} />
      </defs>
      <rect width="800" height="1000" fill={`url(#${id}-wall)`} />
      <rect x="80" y="80" width="640" height="36" fill="#FFFFFF" />
      <g data-light-patch="">
        <rect x="80" y="116" width="640" height="700" fill={`url(#${id}-shaft)`} />
        <rect x="80" y="116" width="640" height="700" fill={`url(#${id}-shaft)`} opacity="0.5" filter="url(#soften)" />
      </g>
      <g fill="#A8A196" opacity="0.55">
        {books.map((b) => (
          <rect key={b.key} x={b.x} y={b.y - b.h} width={b.w} height={b.h} />
        ))}
      </g>
      <g fill="#8C857B">
        {shelves.map((y) => (
          <rect key={y} x="40" y={y} width="720" height="4" />
        ))}
      </g>
      <rect x="520" y="630" width="14" height="90" fill="#B4532F" />
      <GrainRect />
    </StudySvg>
  );
}
