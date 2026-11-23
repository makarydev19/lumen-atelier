/** "01 / 05" — ANIM swaps digits inside [data-counter-mask] (two stacked spans, 1-line mask). */
export function GalleryCounter({ total }: { total: number }) {
  return (
    <p className="t-label tabular" aria-hidden="true" data-gallery-counter="">
      <span className="relative inline-flex h-[1.2em] flex-col overflow-hidden align-bottom" data-counter-mask="">
        <span data-counter-current="">01</span>
        <span data-counter-next="" className="absolute left-0 top-full">
          01
        </span>
      </span>
      <span className="text-stone"> / {String(total).padStart(2, "0")}</span>
    </p>
  );
}
