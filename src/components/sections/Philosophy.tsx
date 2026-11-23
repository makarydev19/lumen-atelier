import type { PhilosophyContent } from "@/content/types";
import { media } from "@/content/media";
import { renderRich } from "@/lib/rich-text";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ScrubStatement } from "./ScrubStatement";

/**
 * §3.2 Philosophy. ANIM hooks: section[data-pin-section="philosophy"] (pin, desktop),
 * h2[data-anim="words-scrub"], [data-rule] (scaleX), [data-anim="lines"] notes, beam MediaFrame (window + speed).
 */
export function Philosophy({ content }: { content: PhilosophyContent }) {
  return (
    <section
      id="philosophy"
      data-theme="light"
      data-pin-section="philosophy"
      aria-labelledby="philosophy-title"
      className="relative py-[var(--section-y)]"
    >
      <div className="grid-site">
        <div className="col-span-full mb-6 lg:col-[1/3] lg:mb-0">
          <div className="lg:sticky lg:top-32">
            <Eyebrow index={content.index}>{content.eyebrow}</Eyebrow>
          </div>
        </div>
        <div className="col-span-full lg:col-[3/13]">
          <ScrubStatement id="philosophy-title" text={renderRich(content.statement)} />
        </div>

        <div className="col-span-full mt-16 lg:col-[3/13] lg:mt-32">
          <div data-rule="" className="h-px origin-left" style={{ background: "var(--rule)" }} />
        </div>

        <div className="col-span-full mt-10 grid grid-cols-subgrid gap-y-6 lg:col-[3/13] lg:mt-12">
          <div className="hidden lg:col-[1/3] lg:block">
            <MediaFrame
              media={media[content.media]}
              shape="arch"
              size="sm"
              speed={0.9}
              frameClassName="h-[240px] w-[180px]"
            />
          </div>
          <p className="col-span-full text-muted measure md:col-span-4 lg:col-[5/8]" data-anim="lines">
            {content.notes[0]}
          </p>
          <div className="col-span-full md:col-span-4 lg:col-[8/11]">
            <p className="text-muted measure" data-anim="lines">
              {content.notes[1]}
            </p>
            <p className="t-label mt-8" data-anim="lines">
              {content.signature}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
