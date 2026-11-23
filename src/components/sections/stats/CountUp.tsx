import { cn } from "@/lib/cn";

/**
 * Server-renders the FINAL number. Screen readers get the sr-only value;
 * the visible span is aria-hidden and carries data-anim="count" data-count-to for ANIM.
 */
export function CountUp({ to, className }: { to: number; className?: string }) {
  return (
    <>
      <span className="sr-only">{to}</span>
      <span
        aria-hidden="true"
        data-anim="count"
        data-count-to={to}
        className={cn("inline-block min-w-[2ch] tabular", className)}
      >
        {to}
      </span>
    </>
  );
}
