import type { ContactContent } from "@/content/types";
import { renderRich } from "@/lib/rich-text";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Button } from "@/components/ui/Button";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { StudioAddress } from "./StudioAddress";
import { Wordmark } from "./Wordmark";
import { BackToTop } from "./BackToTop";

/**
 * §3.6 Contact footer. ANIM hooks: h2[data-anim="lines"], [data-contact-fade] (body/email/button/studios/social),
 * [data-dusk] (scrub opacity + yPercent), Wordmark chars, [data-back-to-top].
 */
export function ContactFooter({ content }: { content: ContactContent }) {
  const email = content.email;
  const [user, domain] = email.split("@");
  return (
    <footer
      id="contact"
      data-theme="dark"
      aria-labelledby="contact-title"
      className="relative isolate overflow-clip pt-[var(--section-y)]"
    >
      {/* §4.4 dusk glow */}
      <div
        aria-hidden="true"
        data-dusk=""
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 110%, rgb(180 83 47 / 0.28) 0%, rgb(28 26 24 / 0) 60%)",
        }}
      />

      <div className="grid-site gap-y-6">
        <div className="col-span-full lg:col-[1/3]">
          <Eyebrow index={content.index}>{content.eyebrow}</Eyebrow>
        </div>
        <div className="col-span-full lg:col-[3/12]">
          <SplitHeading as="h2" size="statement" anim="lines" id="contact-title">
            {renderRich(content.headline)}
          </SplitHeading>
        </div>

        <p className="t-lead col-span-full mt-4 text-stone md:col-[1/6] lg:col-[3/7] lg:mt-10" data-contact-fade="">
          {content.body}
        </p>

        <div className="col-span-full mt-6 flex flex-col gap-8 lg:col-[3/13] lg:mt-10 lg:flex-row lg:items-center lg:gap-12" data-contact-fade="">
          <MagneticLink
            href={`mailto:${email}`}
            className="font-serif text-[22px] leading-[1.15] tracking-[-0.01em] text-bone [overflow-wrap:anywhere] md:text-h3"
          >
            <span className="email-link">
              {user}@<wbr />
              {domain}
            </span>
          </MagneticLink>
          <Button href={content.cta.href} variant="bone" icon="arrow-up-right" magnetic className="w-full md:w-auto">
            {content.cta.label}
          </Button>
        </div>

        <div className="col-span-full mt-16 h-px lg:mt-32" style={{ background: "var(--rule)" }} />

        <div className="col-span-full grid grid-cols-subgrid gap-y-10 pt-4">
          <div className="col-span-full md:col-span-4 lg:col-[3/6]">
            <StudioAddress {...content.studios[0]} />
          </div>
          <div className="col-span-full md:col-span-4 lg:col-[6/9]">
            <StudioAddress {...content.studios[1]} />
          </div>
          <nav aria-label="Social" className="col-span-full lg:col-[10/13]" data-contact-fade="">
            <ul className="t-label flex flex-wrap gap-x-6 gap-y-1 lg:flex-col">
              {content.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="u-link inline-flex min-h-11 items-center text-clay"
                  >
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="col-span-full mt-16 flex flex-col gap-2 text-small text-stone md:flex-row md:items-center md:justify-between lg:mt-24">
          <p>{content.copyright}</p>
          <div className="flex items-center gap-6">
            <a href={content.privacy.href} className="u-link inline-flex min-h-11 items-center" data-cursor="link">
              {content.privacy.label}
            </a>
            <BackToTop label={content.backToTop} />
          </div>
        </div>
      </div>

      <div className="mt-8 px-[var(--margin-eff)] pb-6">
        <Wordmark text={content.wordmark} />
      </div>
    </footer>
  );
}
