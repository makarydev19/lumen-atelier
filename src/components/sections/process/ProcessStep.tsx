import type { ProcessStepContent } from "@/content/types";
import { Tag } from "@/components/ui/Tag";

/** §3.4 step. ANIM hooks: li[data-step][data-step-index] (active trigger), [data-step-content] (fade-up), [data-tag]. */
export function ProcessStep({ step, index }: { step: ProcessStepContent; index: number }) {
  return (
    <li
      data-step=""
      data-step-index={index}
      className="border-t py-12 first:border-t-0 lg:flex lg:min-h-[80svh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-0"
      style={{ borderColor: "var(--rule)" }}
    >
      <p
        aria-hidden="true"
        className="font-serif text-[64px] leading-[0.9] tracking-[-0.04em] text-terra tabular lg:hidden"
      >
        {step.number}
      </p>
      <div className="t-label mt-6 flex items-center gap-4 lg:mt-0" data-step-content="">
        <span className="hidden text-terra-ink lg:inline tabular">{step.number}</span>
        <span className="text-muted">{step.duration}</span>
      </div>
      <h3 className="mt-4 text-h3" data-step-content="">
        <span className="sr-only">Step {step.number}: </span>
        {step.title}
      </h3>
      <p className="mt-4 max-w-[46ch]" data-step-content="">
        {step.body}
      </p>
      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Deliverables" data-step-content="">
        {step.deliverables.map((d) => (
          <li key={d}>
            <Tag>{d}</Tag>
          </li>
        ))}
      </ul>
    </li>
  );
}
