import type { ProcessStepContent, SectionHeading } from "@/content/types";
import { media } from "@/content/media";
import { renderRich } from "@/lib/rich-text";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ProcessStep } from "./ProcessStep";
import { ProcessNumeral } from "./ProcessNumeral";

/**
 * §3.4 Process. Desktop: left column is CSS sticky ([data-process-sticky]); right column holds
 * [data-steps] (trigger for the vertical progress line). ANIM hooks: [data-process-progress-fill] (scaleY),
 * [data-step-label][data-active] (label list), ProcessVisual [data-layer] groups (desktop instance is
 * `data-mode="progressive"`), numeral swap.
 */
export function ProcessSection({
  heading,
  intro,
  steps,
}: {
  heading: SectionHeading;
  intro: string;
  steps: ProcessStepContent[];
}) {
  return (
    <section
      id="process"
      data-theme="light"
      aria-labelledby="process-title"
      className="relative py-[var(--section-y)] lg:py-0"
    >
      <div className="grid-site">
        {/* Left: sticky (desktop) */}
        <div className="col-span-full lg:col-[1/6]">
          <div
            data-process-sticky=""
            className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:pt-[var(--header-h)]"
          >
            <Eyebrow index={heading.index}>{heading.eyebrow}</Eyebrow>
            <SplitHeading as="h2" size="h2" anim="lines" id="process-title" className="mt-6">
              {renderRich(heading.title)}
            </SplitHeading>

            <div className="mt-10 hidden items-end gap-8 lg:flex">
              <MediaFrame
                media={media.process}
                shape="arch"
                size="md"
                idPrefix="pv-desktop"
                processMode="progressive"
                anim="none"
                className="shrink-0"
                frameClassName="h-[min(440px,calc(100svh-400px))] aspect-[360/440]"
              />
              <div className="flex flex-col gap-8" aria-hidden="true">
                <ProcessNumeral total={steps.length} />
                <div className="flex gap-4">
                  <div className="relative h-[min(240px,calc(100svh-640px))] min-h-28 w-px" style={{ background: "var(--rule)" }}>
                    <div data-process-progress-fill="" className="absolute inset-0 origin-top scale-y-0 bg-terra" />
                  </div>
                  <ol className="t-label flex flex-col justify-between">
                    {steps.map((s, i) => (
                      <li
                        key={s.number}
                        data-step-label=""
                        data-active={i === 0 ? "true" : "false"}
                        className="relative text-graphite data-[active=true]:text-ink"
                      >
                        <span
                          data-step-dot=""
                          className={`absolute -left-[22px] top-1/2 size-[5px] -translate-y-1/2 rounded-full bg-terra ${i === 0 ? "scale-100" : "scale-0"}`}
                        />
                        {s.title}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: intro + steps */}
        <div className="col-span-full lg:col-[7/13] lg:pt-[var(--section-y)] lg:pb-[10svh]">
          <p className="t-lead mt-8 lg:mt-0" data-anim="lines">
            {intro}
          </p>

          <div className="mt-12 lg:hidden">
            <MediaFrame
              media={media.process}
              shape="arch"
              idPrefix="pv-mobile"
              processMode="composite"
              anim="none"
              frameClassName="aspect-[4/5]"
            />
          </div>

          <ol data-steps="" className="mt-8 lg:mt-0">
            {steps.map((s, i) => (
              <ProcessStep key={s.number} step={s} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
