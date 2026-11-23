import { site } from "@/content/site";

/**
 * §5.1 Preloader markup. Rendered `hidden` so content is never blocked without JS.
 * ANIM: remove `hidden` on first visit (sessionStorage "la-loaded"), run the timeline,
 * then hide again and call onComplete. Hooks: [data-preloader], [data-preloader-logo],
 * [data-preloader-counter], [data-preloader-fill], [data-preloader-label], [data-preloader-edge].
 */
export function Preloader({ onComplete: _onComplete }: { onComplete?: () => void }) {
  void _onComplete;
  return (
    <div
      data-preloader=""
      aria-hidden="true"
      hidden
      className="fixed inset-0 z-[90] bg-ink text-bone"
    >
      <div className="grid-site h-full grid-rows-[auto_1fr_auto] py-6 lg:py-8">
        <p data-preloader-logo="" className="col-span-full font-serif text-[22px] leading-none">
          {site.name}
        </p>
        <p
          data-preloader-counter=""
          className="col-span-full self-center font-serif text-numeral text-clay tabular"
        >
          000
        </p>
        <div className="col-span-full flex flex-col gap-4">
          <p data-preloader-label="" className="t-label self-end">
            Opening the shutters
          </p>
          <div className="relative h-px w-full bg-bone/20">
            <div data-preloader-fill="" className="absolute inset-0 origin-left scale-x-0 bg-bone" />
          </div>
        </div>
      </div>
      <div data-preloader-edge="" className="absolute inset-x-0 bottom-0 h-0.5 origin-center scale-x-[0.2] bg-terra" />
    </div>
  );
}
