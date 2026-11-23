import { cn } from "@/lib/cn";
import { CountUp } from "./CountUp";

/**
 * One stat (<div> group inside the <dl>): <dt> label renders below the <dd> numeral (flex order).
 * The vertical rule (desktop) lives inside the <dd> to keep <dl> content valid.
 */
export function StatItem({ value, label, index }: { value: number; label: string; index: number }) {
  return (
    <div
      data-stat=""
      className={cn(
        "relative flex flex-col",
        index >= 2 && "border-t pt-8 lg:border-t-0 lg:pt-0",
        index % 2 === 1 && "pl-4 md:pl-6",
        index > 0 && "lg:pl-6",
      )}
      style={{ borderColor: "var(--rule)" }}
    >
      <dt className="t-label order-2 mt-4 max-w-[22ch] text-graphite" data-stat-label="">
        {label}
      </dt>
      <dd className="order-1 font-serif text-[64px] leading-[0.9] tracking-[-0.04em] text-terra lg:text-numeral">
        {index > 0 && (
          <span
            aria-hidden="true"
            data-stat-rule=""
            className="absolute bottom-0 left-0 top-0 hidden w-px origin-top lg:block"
            style={{ background: "var(--rule)" }}
          />
        )}
        <CountUp to={value} />
      </dd>
    </div>
  );
}
