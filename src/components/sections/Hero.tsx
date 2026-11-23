import type { HeroContent } from "@/content/types";
import { media } from "@/content/media";
import { renderRich } from "@/lib/rich-text";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { MediaFrame } from "@/components/media/MediaFrame";

/**
 * §3.1 Hero. ANIM hooks: section[data-hero], [data-hero-media] (arch clip + inner scale/parallax),
 * h1[data-anim="lines"] (+ em skew), [data-hero-fade] (eyebrow/lead/CTA/meta/caption),
 * [data-scroll-cue-line], g[data-shaft] inside the SVG, [data-hero-headline] (scroll scrub).
 */
export function Hero({ content }: { content: HeroContent }) {
  return (
    <section
      id="top"
      data-theme="light"
      data-hero=""
      aria-labelledby="hero-title"
      className="relative overflow-clip"
    >
      <div className="grid-site pb-16 pt-24 lg:min-h-[max(100svh,760px)] lg:grid-rows-[auto_1fr_auto] lg:pb-0 lg:pt-0">
        <div className="col-span-full lg:col-[1/5] lg:row-[1] lg:pt-[120px]" data-hero-fade="">
          <Eyebrow>{content.eyebrow}</Eyebrow>
        </div>

        <div
          className="relative z-[2] col-span-full mt-6 lg:col-[1/10] lg:row-[3] lg:mt-0 lg:self-end lg:pb-12"
          data-hero-headline=""
        >
          <SplitHeading as="h1" size="hero" anim="lines" id="hero-title" className="hero-title">
            {renderRich(content.headline)}
          </SplitHeading>
        </div>

        <div
          className="col-span-full mt-8 md:col-[2/8] lg:col-[8/13] lg:row-[1/4] lg:mt-[120px] lg:self-start"
          data-hero-media=""
        >
          <MediaFrame
            media={media[content.media]}
            shape="arch"
            size="lg"
            speed={0.85}
            caption={content.caption}
            priority
            anim="none"
            frameClassName="aspect-[4/5] lg:aspect-auto lg:h-[calc(max(100svh,760px)-240px)]"
          />
        </div>

        <div className="col-span-full mt-8 md:col-[1/7] lg:col-[1/5] lg:row-[2] lg:mb-8 lg:mt-8 lg:self-end">
          <p className="t-lead" data-hero-fade="">
            {content.lead}
          </p>
          <div
            className="mt-8 flex flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-6"
            data-hero-fade=""
          >
            <Button href={content.primaryCta.href} variant="ink" icon="arrow-right" magnetic>
              {content.primaryCta.label}
            </Button>
            <TextLink href={content.secondaryCta.href} className="self-start md:self-auto">
              {content.secondaryCta.label}
            </TextLink>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 hidden lg:block" data-hero-fade="">
        <div className="grid-site">
          <ul className="t-label pointer-events-auto col-[9/13] flex items-end justify-end gap-6 whitespace-nowrap text-muted">
            {content.meta.map((m) => (
              <li key={m}>{m}</li>
            ))}
            <li aria-hidden="true">
              <ScrollCue label={content.scrollLabel} />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
