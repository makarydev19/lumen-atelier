import type { Award, SectionHeading, Stat } from "@/content/types";
import { renderRich } from "@/lib/rich-text";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { StatItem } from "./StatItem";
import { RecognitionList } from "./RecognitionList";

/** §3.5 Studio stats. ANIM hooks: [data-anim="count"], [data-stat-rule] (scaleY), [data-stat-label], recognition rows. */
export function StatsSection({
  heading,
  body,
  stats,
  recognition,
  recognitionLabel,
}: {
  heading: SectionHeading;
  body: string;
  stats: Stat[];
  recognition: Award[];
  recognitionLabel: string;
}) {
  return (
    <section id="studio" data-theme="linen" aria-labelledby="studio-title" className="relative py-[var(--section-y)]">
      <div className="grid-site gap-y-6">
        <div className="col-span-full lg:col-[1/3]">
          <Eyebrow index={heading.index}>{heading.eyebrow}</Eyebrow>
        </div>
        <div className="col-span-full md:col-[1/6] lg:col-[3/8]">
          <SplitHeading as="h2" size="h2" anim="lines" id="studio-title">
            {renderRich(heading.title)}
          </SplitHeading>
        </div>
        <p className="col-span-full measure md:col-[6/9] md:self-end lg:col-[9/13]" data-anim="lines">
          {body}
        </p>

        <dl className="col-span-full mt-16 grid grid-cols-2 gap-y-8 lg:mt-32 lg:grid-cols-4 lg:gap-0">
          {stats.map((s, i) => (
            <StatItem key={s.label} value={s.value} label={s.label} index={i} />
          ))}
        </dl>

        <div className="col-span-full mt-16 lg:col-[3/13] lg:mt-32">
          <RecognitionList items={recognition} label={recognitionLabel} />
        </div>
      </div>
    </section>
  );
}
