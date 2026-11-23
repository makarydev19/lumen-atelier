import type { MediaKey } from "./media";

/**
 * Rich text convention used in headline copy:
 *  - `*word*`  → <em> (italic serif accent, one per headline)
 *  - `|`       → line break shown only at desktop (lg+)
 */
export type RichText = string;

export interface NavItem {
  label: string;
  href: string;
}

export type LinkItem = NavItem;

export interface SectionHeading {
  index: string;
  eyebrow: string;
  title: RichText;
}

export interface HeroContent {
  eyebrow: string;
  headline: RichText;
  lead: string;
  primaryCta: LinkItem;
  secondaryCta: LinkItem;
  meta: string[];
  scrollLabel: string;
  media: MediaKey;
  caption: string;
}

export interface PhilosophyContent {
  index: string;
  eyebrow: string;
  statement: RichText;
  notes: string[];
  signature: string;
  media: MediaKey;
}

export interface Project {
  slug: string;
  title: string;
  type: string;
  place: string;
  year: string;
  blurb: string;
  media: MediaKey;
}

export interface EndCardContent {
  title: RichText;
  body: string;
  cta: LinkItem;
}

export interface WorkContent {
  heading: SectionHeading;
  intro: string;
  projects: Project[];
  endCard: EndCardContent;
}

export interface ProcessStepContent {
  number: string;
  title: string;
  duration: string;
  body: string;
  deliverables: string[];
}

export interface ProcessContent {
  heading: SectionHeading;
  intro: string;
  steps: ProcessStepContent[];
}

export interface Stat {
  value: number;
  label: string;
}

export interface Award {
  title: string;
  year: string;
}

export interface StudioContent {
  heading: SectionHeading;
  body: string;
  stats: Stat[];
  recognitionLabel: string;
  recognition: Award[];
}

export interface StudioAddressContent {
  city: string;
  address: string;
  phone: string;
}

export interface ContactContent {
  index: string;
  eyebrow: string;
  headline: RichText;
  body: string;
  email: string;
  cta: LinkItem;
  studios: StudioAddressContent[];
  social: LinkItem[];
  copyright: string;
  privacy: LinkItem;
  backToTop: string;
  wordmark: string;
}

export interface SiteContent {
  name: string;
  locations: string;
  email: string;
  coordinates: string;
  nav: NavItem[];
  cta: LinkItem;
  hero: HeroContent;
  philosophy: PhilosophyContent;
  work: WorkContent;
  process: ProcessContent;
  studio: StudioContent;
  contact: ContactContent;
}
