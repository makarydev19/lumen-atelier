/** Progress hairline; ANIM scrubs [data-progress-fill] scaleX 0 → 1 (origin left). */
export function GalleryProgress() {
  return (
    <div className="relative h-px w-full" style={{ background: "var(--rule-dark)" }} aria-hidden="true" data-gallery-progress="">
      <div data-progress-fill="" className="absolute inset-0 origin-left scale-x-0 bg-clay" />
    </div>
  );
}
