import type { EndCardContent } from "@/content/types";
import { renderRich } from "@/lib/rich-text";
import { TextLink } from "@/components/ui/TextLink";

export function EndCard({ content }: { content: EndCardContent }) {
  return (
    <li
      className="shrink-0 border-t pt-10 md:w-[420px] md:self-center md:border-l md:border-t-0 md:py-6 md:pl-12 md:pt-6"
      style={{ borderColor: "var(--rule)" }}
      data-card=""
      data-end-card=""
    >
      <h3 className="text-h3" data-card-text="">
        {renderRich(content.title)}
      </h3>
      <p className="mt-4 max-w-[36ch] text-stone" data-card-text="">
        {content.body}
      </p>
      <div className="mt-6" data-card-text="">
        <TextLink href={content.cta.href} tone="dark">
          {content.cta.label}
        </TextLink>
      </div>
    </li>
  );
}
