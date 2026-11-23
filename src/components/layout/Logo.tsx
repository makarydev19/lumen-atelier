import { site } from "@/content/site";

export function Logo({ withLocations = false }: { withLocations?: boolean }) {
  return (
    <a
      href="#top"
      className="inline-flex min-h-11 items-start gap-2 font-serif text-[22px] leading-none tracking-[-0.01em] lg:text-[26px]"
      data-cursor="link"
      data-logo=""
      aria-label={`${site.name} — back to top`}
    >
      <span className="self-center">{site.name}</span>
      {withLocations && (
        <sup className="t-label hidden pt-2 text-[10px] opacity-70 lg:inline">{site.locations}</sup>
      )}
    </a>
  );
}
