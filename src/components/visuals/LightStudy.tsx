import type { LightStudyVariant } from "@/content/media";
import { HeroStudy } from "./studies/hero";
import { BeamStudy } from "./studies/beam";
import { AlveoloStudy } from "./studies/alveolo";
import { SaltStudy } from "./studies/salt";
import { HaldeStudy } from "./studies/halde";
import { OurseStudy } from "./studies/ourse";
import { VesterbroStudy } from "./studies/vesterbro";

export type StudyProps = { title: string; id: string };

const studies: Record<LightStudyVariant, (p: StudyProps) => React.JSX.Element> = {
  hero: HeroStudy,
  beam: BeamStudy,
  alveolo: AlveoloStudy,
  salt: SaltStudy,
  halde: HaldeStudy,
  ourse: OurseStudy,
  vesterbro: VesterbroStudy,
};

/** Inline SVG illustration of light in a room (DESIGN.md §4.1–4.2). */
export function LightStudy({ variant, title, idPrefix }: { variant: LightStudyVariant; title: string; idPrefix?: string }) {
  const Study = studies[variant];
  return <Study title={title} id={idPrefix ?? `ls-${variant}`} />;
}
