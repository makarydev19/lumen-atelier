/**
 * Giant sticky numeral (desktop). aria-hidden duplicate of step numbers.
 * ANIM: swap [data-numeral-current] / [data-numeral-next] inside the 1-line mask [data-numeral-mask].
 */
export function ProcessNumeral({ total, active = 1 }: { total: number; active?: number }) {
  const fmt = (n: number) => String(n).padStart(2, "0");
  return (
    <div
      aria-hidden="true"
      data-process-numeral=""
      data-total={total}
      className="relative overflow-hidden font-serif text-[min(var(--text-numeral),9rem)] leading-[0.9] tracking-[-0.04em] text-terra tabular"
      data-numeral-mask=""
    >
      <span className="block" data-numeral-current="">
        {fmt(active)}
      </span>
      <span className="absolute left-0 top-full block" data-numeral-next="">
        {fmt(active)}
      </span>
    </div>
  );
}
