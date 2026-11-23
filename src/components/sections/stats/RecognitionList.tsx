import type { Award } from "@/content/types";

/** ANIM hooks: li[data-award] with span[data-rule] (scaleX) + [data-award-text]. */
export function RecognitionList({ items, label }: { items: Award[]; label: string }) {
  return (
    <div>
      <h3 className="t-label" id="recognition-title">
        {label}
      </h3>
      <ul className="mt-6" aria-labelledby="recognition-title">
        {items.map((a) => (
          <li
            key={a.title}
            data-award=""
            className="award-row relative flex min-h-16 items-center justify-between gap-6 py-4 text-small"
          >
            <span className="award-text" data-award-text="">
              {a.title}
            </span>
            <span className="award-year shrink-0 text-graphite tabular" data-award-text="">
              {a.year}
            </span>
            <span
              aria-hidden="true"
              data-rule=""
              className="absolute inset-x-0 bottom-0 h-px origin-left"
              style={{ background: "var(--rule)" }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
