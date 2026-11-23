/**
 * §5.0 custom cursor markup. Hidden (CSS) until ANIM adds `.has-cursor` to <html>
 * on (hover: hover) and (pointer: fine) without reduced motion.
 * Hooks: .cursor (quickTo x/y), .cursor-disc (scale morph, fixed 104px), .cursor-label.
 */
export function Cursor() {
  return (
    <div aria-hidden="true" className="cursor pointer-events-none fixed left-0 top-0 z-[100]" data-cursor-root="">
      {/* Centring (xPercent/yPercent) and scale are owned by GSAP: src/animations/cursor.ts */}
      <div className="cursor-disc absolute left-0 top-0 grid size-[104px] place-items-center rounded-full">
        <span className="cursor-label t-label text-bone opacity-0">View</span>
      </div>
    </div>
  );
}
