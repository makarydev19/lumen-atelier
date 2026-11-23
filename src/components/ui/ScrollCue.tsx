export function ScrollCue({ label = "Scroll" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-3" data-scroll-cue="">
      <span>{label}</span>
      <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden" style={{ background: "var(--rule)" }}>
        <span data-scroll-cue-line="" className="absolute inset-0 origin-top bg-current" />
      </span>
    </span>
  );
}
