# 01 — Lumen Atelier · Design Spec

> Implementation-ready spec for the CODE and ANIMATION agents. Every choice here is final. Where a value is given, use it exactly. Where this document says "CODE" it describes static structure; "ANIM" describes motion added later.

---

## 1. Concept, audience, tone

**Concept: "Light as material."** Lumen Atelier is a fictional architecture and interiors studio (Lisbon and Copenhagen, est. 2011) that designs with daylight the way others design with stone. The site behaves like a slow walk through one of their buildings. Warm plaster walls (off-white), deep shadow (charcoal), and one terracotta note. Every image sits inside an arched "window" that opens as you approach it. Motion is unhurried and heavy: long expo eases, nothing bounces, nothing spins.

**Audience.** Private clients commissioning a home (45–65, design-literate, high net worth). Developers and hoteliers looking for a signature architect. Editors at architecture magazines. They skim on a phone first, then return on a desktop to look closely.

**Tone of voice.** Quiet, exact, a little poetic, never salesy. Short declarative sentences. Concrete materials (lime, oak, travertine, brass) instead of adjectives like "stunning". First person plural ("we"). No exclamation marks. Numbers set in figures. Italic serif for the single word in each headline that carries the meaning.

---

## 2. Design tokens

All tokens are CSS custom properties on `:root` in `src/app/globals.css`, exposed to Tailwind v4 via `@theme inline`. Names below are the exact names to use.

### 2.1 Colour (60 / 30 / 10)

| Token | Hex | Role | Share |
|---|---|---|---|
| `--color-bone` | `#F3EEE6` | Page background, light surfaces, text on dark | 60% |
| `--color-linen` | `#E7DFD2` | Secondary light surface (Stats band, card backs, input fills) | (in the 60) |
| `--color-ink` | `#1C1A18` | Primary text, dark sections (Projects, Footer), preloader | 30% |
| `--color-char` | `#2A2724` | Raised surface on dark (project card back, menu overlay panels) | (in the 30) |
| `--color-graphite` | `#5C564E` | Secondary text on light, captions, meta | (in the 30) |
| `--color-stone` | `#A39A8E` | Hairlines and rules on light (decorative only, never text on bone); secondary text on ink | (in the 30) |
| `--color-terra` | `#B4532F` | Accent: italic headline words ≥ 24px, cursor "View" disc, progress fills, active dots | 10% |
| `--color-terra-ink` | `#9A4426` | Accent for small text: links, buttons, labels on light surfaces | 10% |
| `--color-clay` | `#D9A07F` | Accent on dark surfaces (italic words, links, numerals on ink) | 10% |

Rules:
- Exactly one accent per viewport is loud. Terracotta never fills a block larger than a button or the cursor disc.
- Lines/rules: `1px solid color-mix(in oklab, var(--color-ink) 14%, transparent)` on light, `color-mix(in oklab, var(--color-bone) 16%, transparent)` on dark. Token: `--rule-light`, `--rule-dark`.
- Selection: `::selection { background: var(--color-terra); color: var(--color-bone); }`.
- No shadows anywhere except the menu overlay panel (`0 30px 80px -20px rgb(28 26 24 / 0.35)`).
- Global grain: a fixed full-viewport overlay (see §4.0) at 5% opacity, `mix-blend-mode: multiply` on light sections. It sits under the cursor and above content, `pointer-events: none`.

### 2.2 Typography

Two families, loaded via `next/font/google` in `src/app/fonts.ts`:

```ts
import { Instrument_Serif, Hanken_Grotesk } from "next/font/google";
export const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
export const sans  = Hanken_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-sans", display: "swap" });
```

- **Instrument Serif 400 / 400 italic**: all display text, headlines, wordmark, big numerals, menu links. Never bold.
- **Hanken Grotesk 300–600**: body (400), lead (300), UI labels and buttons (500, uppercase, tracked), meta numbers (500, `font-variant-numeric: tabular-nums`).

Fluid scale (min at 390px, max at 1440px; computed linearly; use these strings verbatim):

| Token | Size clamp | Line-height | Tracking | Family / weight | Use |
|---|---|---|---|---|---|
| `--text-hero` | `clamp(3.25rem, 0.557rem + 11.05vw, 10.5rem)` (52→168px) | 0.92 | -0.035em | serif 400 | Hero headline |
| `--text-statement` | `clamp(2.125rem, 0.686rem + 5.905vw, 6rem)` (34→96px) | 1.02 | -0.025em | serif 400 | Philosophy statement, Footer CTA |
| `--text-h2` | `clamp(2rem, 1.071rem + 3.81vw, 4.5rem)` (32→72px) | 1.0 | -0.02em | serif 400 | Section titles |
| `--text-h3` | `clamp(1.5rem, 1.129rem + 1.524vw, 2.5rem)` (24→40px) | 1.1 | -0.01em | serif 400 | Project titles, step titles |
| `--text-numeral` | `clamp(4rem, 1.771rem + 9.143vw, 10rem)` (64→160px) | 0.9 | -0.04em | serif 400 | Stats numbers, Process step number |
| `--text-lead` | `clamp(1.125rem, 0.986rem + 0.571vw, 1.5rem)` (18→24px) | 1.45 | -0.005em | sans 300 | Intro paragraphs |
| `--text-body` | `clamp(1rem, 0.954rem + 0.19vw, 1.125rem)` (16→18px) | 1.6 | 0 | sans 400 | Body |
| `--text-small` | `clamp(0.8125rem, 0.789rem + 0.095vw, 0.875rem)` (13→14px) | 1.5 | 0.005em | sans 400 | Captions, footer meta |
| `--text-label` | `clamp(0.6875rem, 0.664rem + 0.095vw, 0.75rem)` (11→12px) | 1.2 | 0.14em, uppercase | sans 500 | Eyebrows, nav, buttons, indices |
| `--text-wordmark` | `15.6vw` (no clamp; tuned so "Lumen Atelier" spans the content width) | 0.8 | -0.045em | serif 400 | Footer giant wordmark |

Body copy measure: max `62ch`. Lead measure: max `34ch`. Headlines use `text-wrap: balance`; paragraphs use `text-wrap: pretty`.

Italic accent rule: in every headline, exactly one word or phrase is wrapped in `<em>` → serif italic, colour `--color-terra` on light, `--color-clay` on dark.

### 2.3 Spacing (8pt base, 4pt half-step)

| Token | px | | Token | px |
|---|---|---|---|---|
| `--space-1` | 4 | | `--space-8` | 64 |
| `--space-2` | 8 | | `--space-9` | 96 |
| `--space-3` | 12 | | `--space-10` | 128 |
| `--space-4` | 16 | | `--space-11` | 160 |
| `--space-5` | 24 | | `--space-12` | 224 |
| `--space-6` | 32 | | | |
| `--space-7` | 48 | | | |

Section vertical padding token `--section-y`: `clamp(6rem, 3.214rem + 11.43vw, 14rem)` (96→224px). Gap between eyebrow and headline: `--space-5`. Headline to body: `--space-6` (mobile) / `--space-7` (desktop).

### 2.4 Grid

| Breakpoint | Range | Columns | Outer margin | Gutter | Max content width |
|---|---|---|---|---|---|
| `sm` (mobile) | 0–767 | 4 | 20px | 16px | 100% |
| `md` (tablet) | 768–1199 | 8 | 32px | 20px | 100% |
| `lg` (desktop) | 1200–1679 | 12 | 48px | 24px | 1584px (content) |
| `xl` | ≥1680 | 12 | auto (centred) | 24px | 1584px |

Implement as a `.grid-site` utility: `display:grid; grid-template-columns: repeat(var(--cols), minmax(0,1fr)); column-gap: var(--gutter); padding-inline: var(--margin); max-width: calc(1584px + 2*var(--margin)); margin-inline:auto`. Column references below are 1-indexed, e.g. "cols 1–7" = `grid-column: 1 / 8`. At 1440 the content width is 1344px, one column ≈ 90px.

Tailwind v4 breakpoints: override to `--breakpoint-md: 48rem; --breakpoint-lg: 75rem; --breakpoint-xl: 105rem;`.

### 2.5 Radii

| Token | Value | Use |
|---|---|---|
| `--radius-none` | 0 | Default; cards and images are square-cornered |
| `--radius-arch` | `999px 999px 0 0` | Arched windows (hero media, project media at rest, process visual) |
| `--radius-pill` | 999px | Buttons, cursor, tags |
| `--radius-sm` | 2px | Focus ring offset container, inputs |

### 2.6 Motion tokens

| Token | CSS | GSAP equivalent | Use |
|---|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | `"expo.out"` | Reveals, entrances |
| `--ease-out-soft` | `cubic-bezier(0.22, 1, 0.36, 1)` | `"power3.out"` | Hovers, UI, cursor |
| `--ease-in-out` | `cubic-bezier(0.87, 0, 0.13, 1)` | `"expo.inOut"` | Curtain, menu, page-level swaps |
| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | `"power3.in"` | Exits |
| (scrub) | linear | `"none"` | Every scroll-scrubbed tween |

| Duration token | ms | Use |
|---|---|---|
| `--dur-instant` | 120 | Colour/opacity micro feedback |
| `--dur-fast` | 240 | Hover, underline, focus |
| `--dur-base` | 480 | Cursor state morph, menu items |
| `--dur-slow` | 900 | Text line reveals |
| `--dur-slower` | 1200 | Curtain, image reveal |
| `--dur-cinematic` | 1600 | Hero media settle |

Stagger tokens: lines `0.08s`, words `0.03s`, chars `0.025s`, cards/items `0.1s`.

Framer Motion transitions mirror these: `{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }` etc. Exported from `src/lib/motion-tokens.ts` as `EASE`, `DUR`, `STAGGER`.

---

## 3. Sitemap and sections

Single page `/` with anchor sections. Order and ids:

```
<Preloader/>                (overlay, first visit per session)
<SiteHeader/>               header
<main>
  #top        Hero
  #philosophy Philosophy
  #work       Selected Projects (horizontal)
  #process    Process (4 steps, sticky)
  #studio     Studio stats
</main>
#contact      Contact footer + giant wordmark
```

Section themes (for page background tweening, see §5): Hero `light`, Philosophy `light`, Work `dark`, Process `light`, Studio `linen`, Contact `dark`. Each `<section>` carries `data-theme="light|dark|linen"`.

Naming convention for animation hooks (CODE must add these; ANIM reads them):
- `data-anim="lines"` SplitText line reveal · `data-anim="words-scrub"` · `data-anim="chars"` · `data-anim="fade-up"` · `data-anim="window"` clip reveal · `data-anim="count"` number count-up (`data-count-to="62"`)
- `data-speed="0.85"` parallax factor on media inners
- `data-cursor="view|link|hide"` cursor state · `data-cursor-label="View"`
- `data-magnetic` (optional value = strength, default `0.35`)
- `data-pin`, `data-track` for the horizontal gallery

---

### 3.0 Header / navigation (`SiteHeader`)

**Purpose.** Wayfinding and the primary conversion action, always reachable.

**Copy.**
- Logo (text, serif): `Lumen Atelier` with a small superscript label `Lisbon · Copenhagen` hidden below `lg`.
- Nav labels: `Work` → `#work`, `Philosophy` → `#philosophy`, `Process` → `#process`, `Studio` → `#studio`, `Contact` → `#contact`.
- CTA button: `Start a project` → `#contact`.
- Mobile toggle: `Menu` / `Close` (text button, label style).

**Desktop (1440).** Height 88px, `position: fixed`, transparent background, `color: currentTheme`. Grid: logo cols 1–3 (serif 26px), nav cols 6–10 (label style, gap 40px, left aligned), CTA cols 11–12 right aligned. Links have an underline that is a 1px `::after` scaled from `scaleX(0)` origin right → `scaleX(1)` origin left on hover (CSS, 240ms `--ease-out-soft`). Active section link gets a 5px terracotta dot before it.

**Mobile (390).** Height 64px. Logo left (serif 22px), `Menu` right. Menu opens `MobileMenu`: full-screen `--color-ink` panel; links in serif at 48px, stacked, left aligned with index numbers `01–05` in label style before each; below: email `hello@lumen-atelier.studio` and the `Start a project` button full width; bottom: `Lisbon 38.71° N · Copenhagen 55.68° N` in small graphite-on-ink (`--color-stone`).

**Components.** `SiteHeader`, `NavLink`, `Button (variant="pill")`, `MobileMenu`, `Logo`.

**Header colour.** Header text colour follows the section beneath it (no blend modes). CODE defaults to ink text; ANIM toggles `data-header-theme` on `<header>` (light → ink text, dark → bone text) using ScrollTriggers on each section at `start: "top 44px"`.

---

### 3.1 Hero (`#top`)

**Purpose.** State who they are and what they make in one look. The first image is light falling through an arched window.

**Copy.**
- Eyebrow (label): `Architecture & Interiors — Est. 2011`
- Headline (h1, `--text-hero`, 3 lines at desktop, forced breaks with `<br class="hidden lg:inline">`):
  `Rooms that` / `hold the` / `<em>light.</em>`
- Lead (`--text-lead`): `We design houses, retreats and public rooms around one material most studios ignore — daylight. Then we build them with lime, oak and stone, slowly.`
- Primary CTA: `View selected work` (pill, ink fill, bone text, arrow icon → `#work`)
- Secondary link: `Our philosophy` (text link with underline → `#philosophy`)
- Meta row (label style, graphite): `Lisbon — Copenhagen` · `62 built works` · `Scroll` (with a 48px vertical hairline that is the scroll indicator)
- Media caption under arch (small, graphite): `Casa Alvéolo, Comporta — 07:40, March`

**Desktop (1440 × 900).** Section height `100svh`, min 760px. Content grid:
- Eyebrow at top: cols 1–4, `padding-top: 152px`.
- Arch media `HeroWindow`: cols 8–12, top aligned at 120px from viewport top, height `calc(100svh - 200px)`, `border-radius: var(--radius-arch)`, overflow hidden. Caption beneath, right aligned.
- Headline: cols 1–9, anchored to the bottom of the section (`align-self: end; padding-bottom: 96px`), `position: relative; z-index: 2`, so the last line ("light.") overlaps the left edge of the arch by ~1.5 columns. Ink text over the light plaster image stays ≥ 7:1 because the arch's left side is the lightest part of the visual.
- Lead: cols 1–4, placed above the headline (`margin-bottom: 48px`), with CTA row below it (gap 24px).
- Meta row: bottom edge, cols 10–12 right aligned, 32px from bottom.

**Mobile (390 × 844).** Stack, `padding-top: 96px`:
1. Eyebrow.
2. Headline (52px, lines break naturally: "Rooms that hold / the *light.*").
3. Arch media full width, aspect 4:5, margin-top 32px.
4. Caption (right aligned).
5. Lead, margin-top 32px.
6. CTA (full width pill) and secondary link below, gap 16px.
7. Meta row hidden except `Scroll` indicator (hidden too on mobile; native scroll is obvious).

**Components.** `Eyebrow`, `SplitHeading as="h1"`, `MediaFrame shape="arch"` (media `hero`), `Button`, `TextLink`, `ScrollCue`.

**Visual.** `LightStudy variant="hero"` (see §4.1).

---

### 3.2 Philosophy (`#philosophy`)

**Purpose.** One big statement read slowly, word by word, so the visitor lowers their scroll speed. Sets the brand belief.

**Copy.**
- Eyebrow: `(01) Philosophy`
- Statement (h2 styled `--text-statement`, `data-anim="words-scrub"`):
  `We begin every project by standing in the empty site at dawn and at dusk. Walls come later. First we decide where the <em>light</em> should land, and where it should rest — because a room is remembered for its quiet, not its square metres.`
- Side note (body, graphite, 2 short paragraphs):
  1. `Our drawings start with a sun path, not a floor plan. Apertures, depths and ceiling heights are tuned until a single beam crosses the kitchen table at breakfast.`
  2. `We work with a small network of masons, joiners and lime plasterers we have known for over a decade. Fewer hands, more care.`
- Signature (label): `— Inês Valadares & Mads Krog, founding partners`

**Desktop.** Section padding `--section-y`. Eyebrow cols 1–2 sticky with the statement. Statement cols 3–12 (max 11 columns wide, ~1200px), left aligned, balanced. Below it, after 128px: a 1px rule across cols 3–12, then side-note paragraphs in cols 7–9 and 10–12 (two columns), signature under the second paragraph. A small `LightStudy variant="beam"` vignette (180 × 240px arch) sits in cols 3–4 aligned with the paragraphs.

**Mobile.** Eyebrow, statement (34px) full width, rule, paragraphs stacked, signature, vignette hidden.

**Components.** `Eyebrow`, `ScrubStatement`, `MediaFrame shape="arch" size="sm"`.

**Visual.** `LightStudy variant="beam"`.

---

### 3.3 Selected Projects (`#work`) — horizontal pinned gallery

**Purpose.** Show the work at large scale; the signature interaction of the site.

**Copy.**
- Eyebrow: `(02) Selected work`
- Title (h2): `Five recent <em>rooms</em>` (desktop on one line)
- Intro (body, stone on ink): `A selection from 2023–2025. Each was drawn around a single moment of light.`
- Counter (label): `01 / 05` (updates as cards pass centre)
- Cards (title / type / place / year / one-liner):
  1. **Casa Alvéolo** — Private residence — Comporta, Portugal — 2025 — `A low courtyard house of lime and cork, carved around one old olive tree.`
  2. **The Salt Library** — Cultural — Aveiro, Portugal — 2024 — `A reading room inside a former salt warehouse, lit only from above.`
  3. **Halde Bathhouse** — Wellness — Bergen, Norway — 2024 — `Six granite pools stepping down a fjord slope, each facing a different hour.`
  4. **Maison Ourse** — Interior — Lyon, France — 2023 — `A fourth-floor apartment re-planned around a single long oak table.`
  5. **Vesterbro Ateliers** — Adaptive reuse — Copenhagen, Denmark — 2023 — `Twelve artists' studios in a 1906 printworks, north light restored.`
- End card: headline (h3) `Thirty-eight more, built <em>quietly.</em>`, body `Our full archive is shared privately with clients and press.`, CTA `Request the portfolio` → `mailto:hello@lumen-atelier.studio?subject=Portfolio%20request`.
- Each card is a link (`<a href="#contact" aria-label="Casa Alvéolo — Private residence, Comporta, 2025. Enquire about this project">`), cursor shows "View".

**Desktop (1440).** Section `data-theme="dark"` (background ink, text bone). Pinned for the horizontal distance.
- Header block at top of the pinned viewport: eyebrow cols 1–2, title cols 3–9, counter cols 11–12 right aligned, top padding 120px.
- Track (`data-track`, `display:flex`, gap 48px, `padding-left: calc(margin + 2 cols)`, `padding-right: 48px`) vertically centred in the remaining height.
- Card size: media 520 × 640px (width ≈ 5 columns), aspect 13:16. Media frame is square-cornered at full reveal; the arch shape is only the starting clip (see motion). Card 2 and 4 are offset `translateY(64px)` statically for rhythm.
- Under media (16px gap): index `01` (label, clay) left, year right; title (h3) below; one-liner (small, stone) max 36ch.
- End card: 420px wide, no media, vertically centred text, left 1px rule.
- Progress bar: bottom of pinned viewport, 48px from bottom, cols 3–12, 1px track `--rule-dark`, fill `--color-clay` scaleX 0→1.

**Mobile (390).** NOT pinned and not horizontal. Vertical list:
- Header: eyebrow, title, intro.
- Each card full width: media aspect 4:5, then meta row, title, one-liner. 64px between cards.
- End card as a block with top rule.
- Counter and progress bar hidden.

Tablet (768–1199): same as desktop, card media 400 × 492px.

**Components.** `ProjectsGallery`, `ProjectCard`, `MediaFrame shape="window"`, `GalleryProgress`, `GalleryCounter`, `EndCard`.

**Visuals.** `LightStudy` variants `alveolo`, `salt`, `halde`, `ourse`, `vesterbro` (§4.2).

---

### 3.4 Process (`#process`) — 4 steps, sticky

**Purpose.** Reassure clients that a slow, crafted process is also a clear one.

**Copy.**
- Eyebrow: `(03) Process`
- Title (h2): `Four <em>seasons</em> of a project`
- Intro (lead): `From first visit to the day you move in, most of our houses take eighteen to thirty months. Here is how that time is spent.`
- Steps (number / title / duration / body / deliverables):
  1. `01` **Listen** — `Months 1–2` — `We spend days on the site and hours in your current home. We map the sun, the wind, the views you want and the ones you don't.` — Deliverables: `Site light study · Brief document · Feasibility`
  2. `02` **Draw** — `Months 3–7` — `Hand sketches first, then models in card and plaster. Every room is tested against the light study before a single wall is fixed.` — `Concept design · Physical models · Planning application`
  3. `03` **Choose** — `Months 8–11` — `We source materials with you, in quarries, mills and workshops. Samples live in your kitchen for a week before you decide.` — `Material palette · Joinery drawings · Tender package`
  4. `04` **Build** — `Months 12–30` — `Our site architect is present twice a week. We stay until the last shelf is oiled and the first winter has passed.` — `Site supervision · Snagging · One-year return visit`

**Desktop.** Two halves. Left: cols 1–5 `position: sticky; top: 0; height: 100svh`, containing eyebrow, title, a giant step numeral (`--text-numeral`, terra) showing the active step, a vertical progress line (1px × 240px, fill terra scaleY) next to 4 small step labels (`Listen / Draw / Choose / Build`, label style, inactive graphite, active ink), and the `ProcessVisual` (arched frame 360 × 440px) under the title. Right: cols 7–12, the intro lead at top, then four `ProcessStep` blocks each `min-height: 80svh`, content vertically centred: number (label, terra-ink) + duration (label, graphite) on one row, title (h3), body (body, max 46ch), deliverables as a row of pill tags (1px `--rule-light` border, small text, 6px 12px padding).

**Mobile.** No sticky. Eyebrow, title, intro, then the `ProcessVisual` (full width, aspect 4:5) once, then the 4 steps stacked (padding 48px 0, separated by rules), each with its own numeral at 64px terra before the title. The visual shows all four layers composited (final state) on mobile.

**Components.** `ProcessSection`, `ProcessStep`, `ProcessNumeral`, `ProcessVisual`, `Tag`.

**Visual.** `ProcessVisual` — one SVG with 4 layered drawings (§4.3).

---

### 3.5 Studio stats (`#studio`)

**Purpose.** Credibility in four numbers plus recognition, in a calm linen band.

**Copy.**
- Eyebrow: `(04) Studio`
- Title (h2): `Small by <em>choice.</em>`
- Body: `Nineteen architects, two studios, and one rule: we never run more than six projects at once. It is the only way we know to stay on site.`
- Stats (numeral / label):
  - `14` — `Years of practice`
  - `62` — `Built works`
  - `9` — `Countries`
  - `6` — `Projects at a time, never more`
- Recognition list (label heading `Recognition`, then rows in small text with year right aligned):
  - `Mies Light Prize — Shortlist` · `2025`
  - `Nordic Interior Awards — Residential of the Year` · `2024`
  - `Portuguese Lime Guild — Honorary Mention` · `2023`
  - `Habitat Quarterly — 40 Studios to Watch` · `2021`

**Desktop.** `data-theme="linen"`. Eyebrow cols 1–2, title cols 3–7, body cols 9–12 aligned with title baseline. 128px below: four stats in a row, each 3 columns, separated by 1px vertical rules (`--rule-light`), numeral (terra) top, label (label style, graphite) 16px below. Numerals use `tabular-nums` and a fixed width box (`min-width: 2ch`) so count-up causes no layout shift. 128px below: rule across cols 3–12, recognition list in cols 3–12 as 4 rows (row height 64px, border-bottom rule; award left cols 3–9, year right cols 12).

**Mobile.** Stack. Stats in a 2 × 2 grid (gap 32px vertical, horizontal rule between rows instead of vertical rules), numerals 64px. Recognition rows full width.

**Components.** `StatsSection`, `StatItem`, `CountUp`, `RecognitionList`.

**Visual.** None (typography only), plus the global grain.

---

### 3.6 Contact footer (`#contact`) with giant wordmark

**Purpose.** Convert, and end the page with a confident brand moment.

**Copy.**
- Eyebrow: `(05) Contact`
- Headline (`--text-statement`): `Tell us about the light you <em>wake up</em> to.`
- Body (lead, stone): `We take on four new commissions each year. Write to us with a site, a sketch, or simply a feeling — we reply to every letter within five days.`
- Big email link (h3 size, bone, underline 1px clay, magnetic): `hello@lumen-atelier.studio`
- Button: `Start a project` (pill, bone fill, ink text, `mailto:hello@lumen-atelier.studio?subject=New%20project`)
- Studios:
  - `Lisbon` — `Rua das Janelas Verdes 41, 1200-690 Lisboa` — `+351 21 390 4410`
  - `Copenhagen` — `Strandgade 27B, 1401 København K` — `+45 32 96 1180`
- Social (label links): `Instagram`, `LinkedIn`, `Are.na`
- Utility row: `© 2026 Lumen Atelier. All rights reserved.` · `Privacy` · `Back to top ↑` (button, scrolls to `#top`)
- Wordmark (giant, `aria-hidden="true"`; the visible logo and `<title>` carry the name): `Lumen Atelier`

**Desktop.** `data-theme="dark"`, padding-top `--section-y`. Eyebrow cols 1–2; headline cols 3–11; 64px below: body cols 3–6, email link cols 3–9 (on its own line, 64px below body), button next to it. 128px below: rule across cols 1–12; then a row: Lisbon cols 3–5, Copenhagen cols 6–8, Social cols 10–12 (stacked labels). 96px below: wordmark spanning cols 1–12 edge to edge (`--text-wordmark`, bone, line-height 0.8, `overflow: clip` on its wrapper, bottom of glyphs flush with a 24px bottom padding). Utility row sits above the wordmark, 32px gap, small text stone.

**Mobile.** Stack: eyebrow, headline (34px), body, email link (wraps after `@`, `overflow-wrap: anywhere`, 22px), full-width button, studios stacked, social in a row, utility row, wordmark (15.6vw ≈ 61px) last.

**Components.** `ContactFooter`, `MagneticLink`, `Button`, `StudioAddress`, `Wordmark`, `BackToTop`.

**Visual.** A faint `LightStudy variant="dusk"` gradient fills the background behind the wordmark (§4.4).

---

## 4. Visual assets plan (no remote images)

All visuals are inline React SVG components in `src/components/visuals/`. Every placement goes through `MediaFrame`, which takes a `media` entry from `src/content/media.ts`:

```ts
export type Media =
  | { kind: "svg"; variant: LightStudyVariant; alt: string }
  | { kind: "image"; src: string; alt: string; width: number; height: number };
// Swap any entry to { kind: "image", src: "/images/alveolo.jpg", ... } and MediaFrame renders next/image instead.
export const media = { hero: {...}, beam: {...}, alveolo: {...}, salt: {...}, halde: {...}, ourse: {...}, vesterbro: {...}, process: {...} } satisfies Record<string, Media>;
```

`MediaFrame` structure (needed for motion): `<figure class="frame">` (clip target, `overflow:hidden`) → `<div class="frame-inner" data-speed>` (parallax target, 116% size, inset -8%) → SVG/`Image` (`preserveAspectRatio="xMidYMid slice"`, `width/height 100%`). `<figcaption>` optional. SVGs carry `role="img"` and `aria-label={alt}`.

### 4.0 Shared SVG primitives (`src/components/visuals/defs.tsx`)

- **Grain filter** `#grain`: `<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>` → `<feColorMatrix type="saturate" values="0"/>` → `<feComponentTransfer><feFuncA type="linear" slope="0.09"/></feComponentTransfer>`, applied to a full-size `<rect>` blended `mix-blend-mode: multiply`. Every LightStudy ends with this rect.
- **Global page grain**: `body::after` fixed, inset 0, `background-image: url("data:image/svg+xml,…")` of the same turbulence at 160 × 160px tile, `opacity: 0.05`, `pointer-events:none`, `z-index: 60`. Static (no animation).
- **Soft shadow filter** `#soften`: `feGaussianBlur stdDeviation="18"`. Used on cast shadow shapes.
- **Light shaft gradient**: `linearGradient` along the shaft axis, stops `#FFF6E8` at 0 opacity 0.95 → `#FFE9CF` at 0.55 opacity 0.6 → `#F3EEE6` at 1 opacity 0.

Every LightStudy has `viewBox="0 0 800 1000"` (4:5) and is composed of: (1) wall gradient, (2) aperture shape(s) that emit light, (3) cast light patch on floor/wall (polygon, blurred edges via `#soften` on a duplicate at 50% opacity), (4) cast shadow of a mullion or object, (5) one accent object, (6) grain.

### 4.1 `hero` — "Morning arch"
- Wall: vertical linearGradient `#EFE7DB` (top) → `#E2D6C5` (60%) → `#CDBDA8` (bottom). Floor plane: rect y 760–1000, fill `#BFA88E` → `#A88F75`.
- Aperture: arched window on the right wall seen frontally, path: rect x 470–690, y 180–620 with semicircle top (r 110). Fill: radial gradient `#FFF8EC` centre → `#F6E3C6` edge (it reads as bright sky through glass). Two mullions: vertical 6px bar at x 577, horizontal at y 430, fill `#CDBDA8`.
- Cast light: a skewed arch polygon on the floor and lower left wall: points `(120,1000) (380,1000) (520,760) (330,760)` plus an arched top projected onto the wall from (180,760) to (360, 520). Fill light-shaft gradient, then duplicate blurred.
- Cast mullion shadow inside the light patch: 2 thin quads `#B79E84` at 35% opacity, blurred stdDeviation 3.
- Accent object: a low terracotta vessel silhouette at (210, 700) — path of an amphora 90 × 150px, fill `#B4532F` → `#8E3F22` vertical gradient, with a 1px highlight line `#D9A07F`.
- Atmosphere: a diagonal shaft polygon from the window to the floor `(470,240) (690,240) (380,1000) (120,1000)`, fill shaft gradient at 25% opacity, `mix-blend-mode: screen`.

### 4.2 Project variants (same recipe, distinct silhouette and palette)
| Variant | Wall gradient (top → bottom) | Aperture | Light patch | Accent |
|---|---|---|---|---|
| `alveolo` | `#EDE3D4` → `#D8C6AE` | Square courtyard opening in a ceiling, seen in one-point perspective: inner rect 300×300 at centre top, receding lines to frame corners in `#C7B49B` | Square patch on floor, skewed `(260,760) (560,760) (620,940) (200,940)` | Olive tree: circle cluster (7 circles r 30–60) `#6F6B4E` at 80% + trunk path `#4A3F33`, positioned in the patch |
| `salt` | `#E9E6E1` → `#BDB7AE` (cool grey) | Long rooflight slot: rect 640×36 at y 80, fill `#FFFFFF` | Vertical wash down the back wall: rect 640×700, shaft gradient top→bottom | Rows of bookshelves: 6 horizontal 4px lines `#8C857B` across the lower half; one terracotta book spine 14×90 `#B4532F` |
| `halde` | `#3A3A3D` → `#1F2023` (dark granite, the only dark study) | Horizontal letterbox window rect 700×120 at y 300, fill gradient `#DCE3E6` → `#9FB0B8` (fjord sky) | Reflection on water: rect y 720–1000, `#2E3236` with 5 horizontal ellipses (rx 200–320, ry 3) `#C9D3D8` at 30–60% opacity | Steaming pool edge line `#D9A07F` 2px at y 720; steam = 3 blurred ellipses white 15% |
| `ourse` | `#F1E8DC` → `#DCCBB4` | Tall French window left side, rect x 60–260, y 120–820, 4 panes, fill `#FFF5E6` | Long rhombus across the floor to the right `(260,820) (760,880) (760,1000) (180,1000)` | Long oak table: rect 520×26 at y 700 `#9C6B43` with 2 legs, and a terracotta bowl (half ellipse rx 40) `#B4532F` |
| `vesterbro` | `#E4E1DA` → `#C9C3B8` | Sawtooth north-light roof: 4 triangles across the top (each 200 wide, 140 tall), glazed faces `#F7F8F6`, solid faces `#B7AFA3` | 4 soft parallel diagonal bands on the floor, shaft gradient at 40% | Easel silhouette (3 lines, 3px, `#3A332C`) with a canvas rect `#B4532F` 80×100 |
| `beam` | `#EFE7DB` → `#D6C7B3` | Small high circular oculus r 50 at (560,160), fill `#FFF8EC` | Single narrow beam (polygon 60 wide at top → 160 wide at floor) ending in an ellipse rx 120 ry 30 on the floor | None — the beam is the subject |
| `dusk` (footer bg) | Not a frame. Full-bleed `radial-gradient(120% 80% at 50% 110%, rgb(180 83 47 / 0.28) 0%, rgb(28 26 24 / 0) 60%)` over ink, plus grain at 6% | — | — | — |

### 4.3 `ProcessVisual` (one SVG, 4 layers, `viewBox 0 0 720 880`, arch-clipped)
Background `#E7DFD2`. Stroke-based line art, stroke `#1C1A18`, width 1.5, `vector-effect: non-scaling-stroke`, `fill:none`, each path has `pathLength="1"` so `stroke-dasharray:1; stroke-dashoffset:1→0` works.
1. **Listen** (`g#layer-listen`): 9 concentric irregular contour lines (site topography) drawn as smooth closed paths centred at (360,520), radii 60→340, plus a sun-path arc dashed (`stroke-dasharray: 4 6`) from (60,300) to (660,300) apex (360,90), with a small sun circle r 14 filled `#B4532F` at the apex.
2. **Draw** (`g#layer-draw`): a floor plan — outer rect 420×300 at (150,400), 3 interior walls, 2 door arcs (quarter circles r 50), a courtyard square 100×100, window gaps (breaks in the outer line).
3. **Choose** (`g#layer-choose`): 4 material swatch circles r 54 at y 760, x 180/300/420/540, filled: travertine `#D8CBB4`, oak `#A87A4F`, lime `#EEE9DF` (with 1px stroke), brass `#B8955A`; labels in label-style SVG text below (`TRAVERTINE`, `OAK`, `LIME`, `BRASS`), font Hanken Grotesk 500 11px, tracking 0.14em.
4. **Build** (`g#layer-build`): section elevation overlay — a house section line (pitched roof, two floors) at top half, with a filled light-shaft polygon (shaft gradient) entering through a roof window and landing on the floor plan's table position.
Desktop: layers are progressive (step N shows layers 1..N, with earlier layers dimmed to 25% opacity). Mobile/reduced-motion: all four layers visible, layers 1–3 at 40% opacity, layer 4 at 100%.

### 4.4 Icons
Inline SVG, 1.5px stroke, 16px: `ArrowRight`, `ArrowUpRight`, `ArrowUp`, `Plus` (menu). No icon library.

### 4.5 Favicon / OG
`src/app/icon.svg`: 32×32, ink square, bone serif "L" with a terracotta 4px arch dot. `opengraph-image.tsx`: 1200×630, bone background, hero headline in Instrument Serif, small terracotta arch at right.

---

## 5. Motion storyboard

Libraries: **GSAP 3 + ScrollTrigger + SplitText** (all scroll, text, pin, scrub), **Lenis** (smooth scroll), **Framer Motion** (`motion/react`: mobile menu, button/link micro-interactions, AnimatePresence). Register plugins once in `src/animations/gsap.ts` (`"use client"`, `gsap.registerPlugin(ScrollTrigger, SplitText)`). Use `useGSAP` from `@gsap/react` with `scope` refs for cleanup. Wait for `document.fonts.ready` before any SplitText.

Global rules: animate only `transform`, `opacity`, `clip-path`, and `color/background-color` for theme tweens. Content is server-rendered visible; the initial hidden states are set by JS (`gsap.set`) only after mount and only when motion is allowed, so no-JS and reduced-motion users always see content. Use `autoAlpha` for fades. `ScrollTrigger.matchMedia` via `gsap.matchMedia()` with conditions:

```ts
mm.add({ isDesktop: "(min-width: 1200px) and (prefers-reduced-motion: no-preference)",
         isMobile:  "(max-width: 1199px) and (prefers-reduced-motion: no-preference)",
         isPinGallery: "(min-width: 768px) and (prefers-reduced-motion: no-preference)", // §5.4 only
         reduce:    "(prefers-reduced-motion: reduce)" }, ctx => { ... });
```

### 5.0 Page level

**Lenis** (`src/animations/SmoothScroll.tsx`, client provider wrapping `<body>` children):
`new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1, syncTouch: false, anchors: false })`. Bridge: `lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)`. Anchor clicks (`a[href^="#"]`) call `lenis.scrollTo(target, { duration: 1.6, easing: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t), offset: 0 })` then move focus to the target (`tabindex="-1"`, `focus({ preventScroll: true })`). Lenis is stopped (`lenis.stop()`) while the preloader or mobile menu is open. Reduced motion: Lenis is not created; native scroll with `scroll-behavior: auto`.

**Theme background tween.** `<body>` background is driven by `--page-bg`. For each section with `data-theme`, a ScrollTrigger `start: "top 55%"`, `end: "bottom 55%"`, `onToggle(self.isActive)` → `gsap.to(body, { "--page-bg": themeColor, "--page-fg": themeText, duration: 0.8, ease: "power2.inOut", overwrite: true })`. Light = bone/ink, dark = ink/bone, linen = linen/ink. Sections themselves have `background: transparent` when motion is on (class `.js-theme` on `<html>`), and solid backgrounds otherwise. Reduced motion: no tween; sections keep their own solid backgrounds.

**Header.** Hide on scroll down / show on scroll up after 120vh: `ScrollTrigger.create({ start: "top -120%", onUpdate: self => gsap.to(header, { yPercent: self.direction === 1 ? -100 : 0, duration: 0.48, ease: "power3.out" }) })`. Header colour switches via `data-header-theme` (CSS colour transition 240ms). Reduced motion: header always visible, colour switches instantly.

**Custom cursor** (`src/components/cursor/Cursor.tsx`, enabled only for `(hover: hover) and (pointer: fine)` and no reduced motion; adds `.has-cursor` to `<html>` which sets `cursor: none` on `html, a, button` but NOT on `input, textarea`).
- Element: fixed 0,0 `div.cursor` (z 100, `pointer-events:none`) containing `div.cursor-disc` (circle) and `span.cursor-label`.
- Position: `gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" })` and same for `y`; centred by `translate(-50%,-50%)` on the disc.
- States (morph with GSAP 0.48s `power3.out`, on `mouseover` delegation reading `data-cursor`):
  - `default`: 10px disc, fill `--page-fg` (ink on light, bone on dark).
  - `link` (any `a`, `button`, `[data-cursor="link"]`): 44px, fill transparent, 1px border currentColor, `scale` from 10/44.
  - `view` (`[data-cursor="view"]`, project cards): 104px disc, fill `--color-terra`, label `View` (or `data-cursor-label`) bone, label style 12px; label animates `autoAlpha 0→1, y 8→0` 0.3s delay 0.08s.
  - `hide` (`[data-cursor="hide"]`, e.g. the wordmark): scale 0.
- Size changes animate `scale` on a fixed 104px element (never width/height): default scale 0.096, link 0.423, view 1.
- Mousedown: scale ×0.85, 0.15s; mouseup back.
- Leaves window: `autoAlpha 0` 0.24s.
- **Magnetic** (`useMagnetic` hook on `[data-magnetic]`: header CTA, hero CTA, footer email, footer button, Back to top): on `pointermove` within the element's bounds + 24px padding, translate the element by `(pointer - centre) * strength` (strength 0.35, inner text node an extra ×0.15 for parallax) via `quickTo` 0.4s `power3.out`; on leave return to 0 with `elastic.out(1, 0.45)` 0.9s. The cursor also snaps toward the element centre by 40%.
- Touch / reduced motion: no custom cursor, no magnetism, native cursor.

### 5.1 Preloader (`src/components/preloader/Preloader.tsx`)

Shown on the first visit per session (`sessionStorage["la-loaded"]`, read in try/catch). Later visits: skip directly to the hero entrance (5.2) with a 0.2s delay. Markup is a fixed ink overlay (`z 90`) with: top-left logo `Lumen Atelier` (serif 22px, bone), centre-left a 3-digit counter in serif `--text-numeral` (clay), bottom a progress hairline (cols 1–12, 1px, bone at 20% track + bone fill), bottom-right label `Opening the shutters`.

Timeline (`gsap.timeline`, `lenis.stop()` until complete):
| t (s) | What | From → To | Duration / ease |
|---|---|---|---|
| 0.0 | Logo chars (SplitText chars) | `yPercent 100, autoAlpha 0` → `0, 1` | 0.9 / expo.out, stagger 0.025 |
| 0.1 | Label | `autoAlpha 0` → `1` | 0.6 / power3.out |
| 0.2 | Counter value | `0 → 100` (object tween, `snap: 1`, rendered as `String(v).padStart(3,"0")`) | 1.8 / `power2.inOut`; the tween's end is gated: it will not pass 90 until `document.fonts.ready` resolves (pause at 90, resume on ready) |
| 0.2 | Progress hairline fill | `scaleX 0 → 1` (origin left), synced to counter | same as counter |
| 2.1 | Counter, logo, label exit | `yPercent 0 → -110`, `autoAlpha → 0` | 0.6 / power3.in, stagger 0.05 |
| 2.5 | **Curtain**: overlay | `clipPath: inset(0% 0% 0% 0%)` → `inset(0% 0% 100% 0%)` (wipes upward) | 1.2 / expo.inOut |
| 2.5 | Curtain trailing edge: a 2px terra line pinned to the overlay's bottom edge | moves with the overlay (child element), `scaleX 0.2 → 1` | 1.2 / expo.inOut |
| 2.95 | Fire hero entrance (5.2) | — | — |
| 3.7 | Overlay `display:none`, `lenis.start()`, set sessionStorage | — | — |

Reduced motion: no counter animation; overlay shows logo for 0.4s then fades `autoAlpha 1→0` over 0.3s; hero content is already visible. Content under the overlay is in the DOM and focusable only after the overlay is removed (overlay has `aria-hidden="true"`; `<main>` gets `inert` while it is shown, max 4s safety timeout).

### 5.2 Hero
| Element | Trigger | From → To | Duration / ease / stagger |
|---|---|---|---|
| Arch media frame | load (curtain t+0.45) | `clipPath: inset(100% 0% 0% 0% round 999px 999px 0 0)` → `inset(0% 0% 0% 0% round 999px 999px 0 0)` | 1.4 / expo.out |
| Arch media inner | same | `scale 1.25 → 1` | 1.6 / expo.out |
| Headline (SplitText `type:"lines"`, `mask:"lines"`) | same, +0.15 | lines `yPercent 110 → 0` | 1.2 / expo.out / 0.08 |
| `<em>light.</em>` | after headline | `color: ink → terra` is static; add `skewX -8 → 0` on the em's line only | 1.0 / expo.out |
| Eyebrow, lead, CTA row, meta row, caption | same, +0.5 | `y 24 → 0, autoAlpha 0 → 1` | 0.9 / power3.out / 0.08 |
| Scroll cue hairline | after entrance, loop | `scaleY 0 → 1` origin top, then origin bottom `1 → 0` | 1.6 / power2.inOut, repeat -1, repeatDelay 0.4 |
| Arch media inner (parallax) | scroll scrub | `yPercent 0 → 12` while hero scrolls out (`start: "top top", end: "bottom top"`, scrub true) | linear |
| Headline block | scroll scrub | `yPercent 0 → -18`, `autoAlpha 1 → 0.2` (same trigger) | linear |
| Light shaft group inside SVG (`g[data-shaft]`) | pointer move (desktop only) | `rotate ±2deg` around (580,240) from pointer x, `quickTo` 1.2s power3.out | — |

Mobile: same entrance (lines on mobile wrap differently; SplitText runs after fonts load and re-splits on resize via `autoSplit: true`), no pointer shaft, parallax at half amplitude (`yPercent 0 → 6`).
Reduced motion: everything visible immediately; no parallax; scroll cue static.

### 5.3 Philosophy — word-by-word scrub
| Element | Trigger | From → To | Details |
|---|---|---|---|
| Statement words (SplitText `type:"words"`) | scroll **scrub** + **pin** (desktop) | each word `opacity 0.14 → 1` (colour stays ink; `em` words also `color: graphite → terra`) | Desktop: ScrollTrigger `trigger: section, start: "top top", end: "+=150%", pin: true, scrub: 0.6`; tween `stagger: 0.1` across words with `ease: "none"` so words light up sequentially. Mobile: no pin, `start: "top 75%", end: "bottom 45%"` on the statement, `scrub: 0.6`. |
| Eyebrow | enter (`top 80%`) once | `y 16 → 0, autoAlpha 0 → 1` | 0.8 / power3.out |
| Rule under statement | enter once | `scaleX 0 → 1` origin left | 1.2 / expo.out |
| Side-note paragraphs + signature (`data-anim="lines"`) | enter (`top 85%`) once | lines `yPercent 100 → 0` (masked) | 0.9 / expo.out / 0.06 |
| Beam vignette | enter once + scrub | window reveal (5.4 recipe) on enter; inner `yPercent -10 → 10` scrub across the viewport | — |

Reduced motion: words at full opacity, no pin, everything static.

### 5.4 Selected Projects — pinned horizontal gallery (desktop + tablet only)
Setup: `const distance = () => track.scrollWidth - window.innerWidth;`
- **Pin + track**: `gsap.to(track, { x: () => -distance(), ease: "none", scrollTrigger: { trigger: section, start: "top top", end: () => "+=" + distance(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } })` → save as `containerTween`.
- **Header entrance** (before pin): eyebrow/title/intro lines `yPercent 110 → 0`, 1.1s expo.out, stagger 0.08, trigger `top 70%` once.
- **Window reveal per card** (signature): each card's `figure.frame` with `containerAnimation: containerTween`, `start: "left 95%"`, `end: "left 45%"`, scrub true: `clipPath: inset(14% 20% 14% 20% round 999px 999px 0px 0px)` → `inset(0% 0% 0% 0% round 0px 0px 0px 0px)`. Use the same number of values in both strings so GSAP interpolates. The arch window grows into the full frame as it travels toward centre.
- **Inner parallax per card**: `frame-inner` `xPercent -8 → 8`, `containerAnimation`, `start: "left right"`, `end: "right left"`, scrub true.
- **Card text**: index/title/one-liner `y 24 → 0, autoAlpha 0 → 1`, `containerAnimation`, `start: "left 80%"`, toggleActions `play none none reverse`, 0.8s power3.out, stagger 0.06.
- **Progress bar**: `scaleX 0 → 1` origin left, scrubbed by the same pin ScrollTrigger (`onUpdate: self => quickSetter(self.progress)`).
- **Counter**: `01 / 05` updates when a card's centre crosses viewport centre (ScrollTrigger per card with `containerAnimation`, `start: "center center"`, `onToggle`). Digit swap: old digit `yPercent 0 → -100`, new `100 → 0`, 0.5s power3.out (two stacked spans in a 1-line mask).
- **Hover (Framer Motion, desktop)**: card `whileHover` → media inner `scale 1 → 1.04` (0.9s, `[0.22,1,0.36,1]`), title `x 0 → 8`. Cursor → `view`.
- **Background**: section theme `dark` tween (5.0).
- **Mobile (<768)**: tablet 768–1199 keeps the pinned horizontal gallery; below 768 the list is vertical and each card uses the window reveal on vertical scroll: `start: "top 90%"`, `end: "top 40%"`, scrub true, same clip values; inner parallax `yPercent -8 → 8` (`start: "top bottom"`, `end: "bottom top"`). No hover scale on touch.
- Reduced motion: no pin; desktop shows the track as a native horizontally scrollable row (`overflow-x: auto; scroll-snap-type: x mandatory`, visible scrollbar styled thin, keyboard scrollable with `tabindex="0"` and `aria-label="Selected projects, scroll horizontally"`); frames fully revealed; no parallax.

### 5.5 Process — sticky steps
Desktop only (left column is CSS sticky; GSAP does not pin).
| Element | Trigger | From → To | Details |
|---|---|---|---|
| Section header (eyebrow, title lines, intro lines) | enter `top 75%` once | lines `yPercent 110 → 0` | 1.1 / expo.out / 0.08 |
| Active step | each `ProcessStep` ScrollTrigger `start: "top 55%"`, `end: "bottom 55%"`, `onToggle` | sets `activeStep` (React state via a ref callback, no re-render of the heavy tree — update DOM directly) | — |
| Giant numeral | on active change | old `yPercent 0 → -100, autoAlpha → 0`; new `yPercent 100 → 0` | 0.7 / expo.out (masked by an overflow-hidden 1-line box) |
| Step labels list | on active change | active label colour graphite → ink and a 5px terra dot `scale 0 → 1` | 0.3 / power3.out |
| Vertical progress line | scrub across the 4 steps (`trigger: stepsWrapper, start: "top 55%", end: "bottom 55%"`) | `scaleY 0 → 1` origin top | scrub 0.5 |
| ProcessVisual layer N | on step N active | paths `strokeDashoffset 1 → 0` (stagger 0.04, 1.4s, power2.inOut); filled shapes `autoAlpha 0 → 1, scale 0.9 → 1` (0.6s, power3.out, transformOrigin center); previous layers `opacity → 0.25` (0.6s) | Scrolling back up reverses: layer N fades to 0 (0.4s) and dashoffset resets |
| Step content (number row, title, body, tags) | each step enter `top 75%` once | `y 32 → 0, autoAlpha 0 → 1` | 0.9 / power3.out / 0.07; tags stagger 0.05 |

Mobile: steps reveal on enter (same as last row); the ProcessVisual draws all four layers sequentially once on enter (`top 70%`), 0.4s offset between layers, total ≈ 3s. Reduced motion: all visible, visual in final composite state, numeral shows the static per-step numbers.

### 5.6 Studio stats
| Element | Trigger | From → To | Details |
|---|---|---|---|
| Title (lines), body (lines) | enter `top 75%` once | `yPercent 110 → 0` | 1.1 / expo.out / 0.08 |
| Stat numerals (`data-anim="count"`) | enter `top 80%` once | `0 → data-count-to`, `snap: { textContent: 1 }` | 1.8 / `power3.out`, stagger 0.12; text content tween on a span with fixed `min-width` |
| Stat vertical rules | same | `scaleY 0 → 1` origin top | 1.0 / expo.out / 0.12 |
| Stat labels | same, +0.3 | `y 12 → 0, autoAlpha 0 → 1` | 0.7 / power3.out / 0.12 |
| Recognition rows | enter `top 85%` once | border `scaleX 0 → 1` (pseudo element replaced by a `span.rule` child) + text `y 16 → 0, autoAlpha 0 → 1` | 0.9 / expo.out / 0.08 |
| Row hover (CSS) | hover | text `translateX(8px)`, year colour graphite → terra-ink | 240ms ease-out-soft |

Reduced motion: final numbers rendered server-side, nothing animates. Server-render the FINAL numbers in markup; JS sets them to 0 just before the tween (avoids wrong values for no-JS and screen readers; the numeral span has `aria-label` with the final value and the animated text is `aria-hidden`).

### 5.7 Contact footer and wordmark
| Element | Trigger | From → To | Details |
|---|---|---|---|
| Headline (SplitText lines) | enter `top 70%` once | `yPercent 110 → 0` | 1.2 / expo.out / 0.08 |
| Body, email, button, studios, social | enter `top 70%` once, +0.3 | `y 24 → 0, autoAlpha 0 → 1` | 0.9 / power3.out / 0.06 |
| Email underline | hover (CSS) | `scaleX 1 → 0` origin right, then `0 → 1` origin left (two-phase via keyframes) | 2 × 240ms |
| Dusk glow | scrub (`start: "top bottom", end: "bottom bottom"`) | `opacity 0 → 1`, `yPercent 20 → 0` | linear |
| **Giant wordmark** (SplitText `type:"chars"`, masked by wrapper `overflow:clip`) | scroll **scrub** (`trigger: wordmark, start: "top bottom", end: "bottom bottom"`, scrub 0.8) | chars `yPercent 100 → 0` with `stagger: { each: 0.04, from: "center" }`, `ease: "none"` | Reaches rest exactly when the page bottom is reached |
| Wordmark hover (desktop) | pointer move over wordmark | the char nearest the pointer lifts `yPercent -6` and turns clay; neighbours ±1 lift `-3`; quickTo 0.5s power3.out | cursor state `hide` over the wordmark |
| Back to top | click | `lenis.scrollTo(0, { duration: 2.2, easing: expo.inOut })`, then focus the logo link | — |

Reduced motion: all visible; wordmark static; back to top jumps instantly.

### 5.8 Micro-interactions (Framer Motion / CSS)
- **Button (pill)**: on hover a fill circle (`::before`, terra-ink for ink buttons, clay for bone buttons) scales `0 → 1` from the pointer entry point (set `--x/--y` from pointer), 480ms ease-out; label colour swaps at 50%. Arrow icon translates `x 0 → 4` and on the arrow a duplicate slides in from `x -16`. Pressed: `scale 0.97` (Framer `whileTap`). Reduced motion: colour change only.
- **TextLink**: underline as above (240ms).
- **MobileMenu** (AnimatePresence): panel `clipPath inset(0 0 100% 0) → inset(0 0 0% 0)` 0.8s `[0.87,0,0.13,1]`; links `y "110%" → 0` stagger 0.06 delay 0.3 (masked); exit reverses at 0.6s. Toggle text crossfades `Menu` ↔ `Close` (y 100% / -100%). Reduced motion: opacity 0 → 1 over 0.2s.
- **Focus**: never animated away; focus ring appears instantly.

---

## 6. Component inventory and file structure

### 6.1 Components (name — props)
- `Preloader` — `{ onComplete: () => void }`
- `SmoothScroll` — `{ children: ReactNode }` (Lenis provider; exposes `useLenis()`)
- `Cursor` — `{}`
- `SiteHeader` — `{ nav: NavItem[]; cta: LinkItem }`
- `NavLink` — `{ href: string; label: string; active?: boolean }`
- `MobileMenu` — `{ open: boolean; onClose: () => void; nav: NavItem[]; cta: LinkItem; email: string }`
- `Logo` — `{ withLocations?: boolean }`
- `Button` — `{ href?: string; onClick?: () => void; variant: "ink" | "bone" | "outline"; icon?: "arrow-right" | "arrow-up-right" | "arrow-up"; magnetic?: boolean; children: ReactNode }` (renders `<a>` when `href`, else `<button>`)
- `TextLink` — `{ href: string; children: ReactNode; tone?: "light" | "dark" }`
- `Eyebrow` — `{ index?: string; children: ReactNode }` → renders `(01) Philosophy`
- `SplitHeading` — `{ as: "h1" | "h2" | "h3"; size: "hero" | "statement" | "h2" | "h3"; anim?: "lines" | "words-scrub" | "chars"; children: ReactNode }` (keeps `<em>` children intact; adds `data-anim`)
- `MediaFrame` — `{ media: Media; shape: "arch" | "window" | "rect"; size?: "sm" | "md" | "lg"; speed?: number; caption?: string; priority?: boolean; className?: string }`
- `LightStudy` — `{ variant: LightStudyVariant; title: string }` where `LightStudyVariant = "hero" | "beam" | "alveolo" | "salt" | "halde" | "ourse" | "vesterbro"`
- `Grain` — `{}` (SVG defs, rendered once in layout)
- `ScrollCue` — `{ label?: string }`
- `Hero` — `{ content: HeroContent }`
- `ScrubStatement` — `{ text: ReactNode; pinned?: boolean }`
- `Philosophy` — `{ content: PhilosophyContent }`
- `ProjectsGallery` — `{ projects: Project[]; endCard: EndCardContent; heading: SectionHeading }`
- `ProjectCard` — `{ project: Project; index: number; offset?: boolean }`
- `GalleryProgress` — `{}` / `GalleryCounter` — `{ total: number }`
- `EndCard` — `{ content: EndCardContent }`
- `ProcessSection` — `{ heading: SectionHeading; intro: string; steps: ProcessStep[] }`
- `ProcessStep` — `{ step: ProcessStep; index: number }`
- `ProcessNumeral` — `{ total: number }`
- `ProcessVisual` — `{ activeStep?: number; mode: "progressive" | "composite" }`
- `Tag` — `{ children: ReactNode }`
- `StatsSection` — `{ heading: SectionHeading; body: string; stats: Stat[]; recognition: Award[] }`
- `StatItem` — `{ value: number; label: string }` / `CountUp` — `{ to: number; className?: string }`
- `RecognitionList` — `{ items: Award[] }`
- `ContactFooter` — `{ content: ContactContent }`
- `MagneticLink` — `{ href: string; strength?: number; children: ReactNode }`
- `StudioAddress` — `{ city: string; address: string; phone: string }`
- `Wordmark` — `{ text: string }`
- `BackToTop` — `{}`

Content types live in `src/content/types.ts`: `NavItem { label; href }`, `LinkItem`, `Project { slug; title; type; place; year; blurb; media: keyof typeof media }`, `ProcessStep { number; title; duration; body; deliverables: string[] }`, `Stat { value; label }`, `Award { title; year }`, plus section content objects.

### 6.2 File structure
```
src/
  app/
    layout.tsx            # fonts, <Grain/>, <SmoothScroll>, <Cursor/>, <Preloader/>, skip link
    page.tsx              # composes sections from content
    globals.css           # tokens (§2), @theme inline, base styles, grid utility, focus styles
    fonts.ts
    icon.svg
    opengraph-image.tsx
  components/
    layout/   SiteHeader.tsx  NavLink.tsx  MobileMenu.tsx  Logo.tsx  SkipLink.tsx
    ui/       Button.tsx  TextLink.tsx  Eyebrow.tsx  SplitHeading.tsx  Tag.tsx  ScrollCue.tsx  MagneticLink.tsx  Icons.tsx
    media/    MediaFrame.tsx
    visuals/  defs.tsx  Grain.tsx  LightStudy.tsx  studies/{hero,beam,alveolo,salt,halde,ourse,vesterbro}.tsx  ProcessVisual.tsx
    sections/ Hero.tsx  Philosophy.tsx  ScrubStatement.tsx
              projects/{ProjectsGallery,ProjectCard,GalleryProgress,GalleryCounter,EndCard}.tsx
              process/{ProcessSection,ProcessStep,ProcessNumeral}.tsx
              stats/{StatsSection,StatItem,CountUp,RecognitionList}.tsx
              contact/{ContactFooter,StudioAddress,Wordmark,BackToTop}.tsx
    preloader/ Preloader.tsx
    cursor/    Cursor.tsx
  animations/
    gsap.ts               # registerPlugin, defaults { ease: "expo.out", duration: 0.9 }
    SmoothScroll.tsx      # Lenis provider + useLenis
    useReducedMotion.ts
    useSplitReveal.ts     # lines/chars reveal for [data-anim]
    useWordScrub.ts
    useWindowReveal.ts
    useParallax.ts
    useMagnetic.ts
    useThemeTween.ts
    timelines/{preloader,hero,projects,process,stats,footer}.ts
  content/
    site.ts               # all copy from §3 (single source of truth)
    media.ts              # swappable media slots (§4)
    types.ts
  lib/
    motion-tokens.ts      # EASE, DUR, STAGGER (mirrors §2.6)
    cn.ts
public/
  images/                 # empty; drop real photos here and switch entries in media.ts
```

---

## 7. Accessibility

**Contrast (WCAG 2.1, computed):**
| Foreground on background | Ratio | Allowed use |
|---|---|---|
| Ink `#1C1A18` on Bone `#F3EEE6` | 15.02:1 | All text |
| Ink on Linen `#E7DFD2` | 13.12:1 | All text |
| Graphite `#5C564E` on Bone | 6.28:1 | Body, captions |
| Graphite on Linen | 5.48:1 | Body, captions |
| Terra-ink `#9A4426` on Bone | 5.63:1 | Links, labels, small text |
| Terra-ink on Linen | 4.92:1 | Links, labels, small text |
| Terra `#B4532F` on Bone | 4.31:1 | **Large text only** (≥ 24px regular): headline `<em>`, numerals; and non-text UI (≥ 3:1) |
| Bone on Terra-ink | 5.63:1 | Button label on terra-ink fill (hover state) |
| Bone on Terra | 4.31:1 | Cursor "View" label is decorative (`aria-hidden`); never use for real text below 24px |
| Bone on Ink | 15.02:1 | All text on dark |
| Bone on Char `#2A2724` | 12.86:1 | Text on raised dark surfaces |
| Clay `#D9A07F` on Ink | 7.67:1 | Links, italic words, numerals on dark |
| Stone `#A39A8E` on Ink | 6.25:1 | Secondary text on dark |
| Stone on Char | 5.35:1 | Secondary text on raised dark |
| Stone on Bone | 2.40:1 | **Never text.** Decorative hairlines only |

Text over LightStudy art: hero headline overlaps only the lightest wall region (`#EFE7DB` → `#E2D6C5`, ink ≥ 12:1). If an `image` media is swapped in, `MediaFrame` adds a `bone → transparent` 40% left gradient scrim under the overlap area.

**Focus.** Global `:focus-visible { outline: 2px solid var(--color-terra-ink); outline-offset: 3px; border-radius: var(--radius-sm); }`; on dark sections `outline-color: var(--color-clay)`. Pills use `outline-offset: 4px` following the pill radius. Never `outline: none` without replacement. Custom cursor never hides the focus ring. The skip link `Skip to content` (first focusable element, visually hidden until focused, bone pill on ink, top-left 16px) targets `#main`.

**Semantics.**
- Landmarks: `<header>` with `<nav aria-label="Primary">`, `<main id="main">`, `<footer id="contact">`. One `<h1>` (hero). Each section `<section aria-labelledby>` pointing to its h2. Eyebrow numbering `(01)` is wrapped `aria-hidden` so headings read cleanly.
- SplitText: before splitting, set `aria-label` on the heading with its plain text and mark generated line/word/char wrappers `aria-hidden="true"` (SplitText `aria: "auto"` in GSAP 3.13+ does this; verify output).
- Projects: list semantics `<ol>` of cards; each card a single link with a descriptive `aria-label`; the gallery has `aria-roledescription="carousel"` NOT used (it is scroll content, not a widget). In pinned mode, keyboard users tabbing through cards trigger `focusin` → `lenis.scrollTo` the scroll position mapping that card into view (compute from `containerTween.scrollTrigger.start + card.offsetLeft`).
- Process steps: `<ol>`; the sticky numeral and label list are `aria-hidden` duplicates of information already in each step.
- Stats: `<dl>` with `<dt>` label and `<dd>` number (number has `aria-label` final value).
- Mobile menu: toggle `<button aria-expanded aria-controls="mobile-menu">`; open state traps focus within the panel, `Escape` closes and returns focus to the toggle, `<main>` and header siblings get `inert`, body scroll locked (and Lenis stopped).
- Visuals: `LightStudy` `role="img"` with descriptive `aria-label` (e.g. "Illustration: morning light falling through an arched window onto a plaster wall and a terracotta vessel"). Purely decorative (dusk glow, grain, wordmark) are `aria-hidden`.
- Wordmark is `aria-hidden`; the footer also contains the visible studio name in the utility row copyright.
- Touch targets ≥ 44 × 44px (nav links get vertical padding; `Menu` toggle 44px tall).
- `prefers-reduced-motion: reduce`: every fallback listed in §5 applies; additionally CSS `*,*::before,*::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }` scoped to that media query, except focus outlines.
- No horizontal page overflow at any width: the pinned track lives inside a section with `overflow: clip`; the wordmark wrapper clips.
- Language: `<html lang="en">`; place names keep diacritics (Alvéolo, København).

---

## Implementation notes (code agent)

Static build is complete: every section, the copy (`src/content/site.ts`), the media slots (`src/content/media.ts`), the SVG studies (`src/components/visuals/`) and the tokens (`src/app/globals.css`). Without JS everything is visible: the gallery is a native horizontal scroll row on md and up, sections have solid theme backgrounds, and the ProcessVisual shows its layers. **Not built (left for ANIM):** `src/animations/*` (SmoothScroll/Lenis, gsap registration, hooks, timelines).

### Animation hooks (selector → intended animation)
| Selector | Intended animation |
|---|---|
| `section[data-theme]`, `footer[data-theme]` | Theme tween of `--page-bg/--page-fg` on `<body>`; add `.js-theme` to `<html>` to make sections transparent |
| `header[data-site-header]` + `data-header-theme="light|dark"` | Hide/show yPercent; colour switch (CSS already restyles the text and the CTA for `dark`) |
| `[data-nav-link="work"…]` + `data-active`, `[data-nav-dot]` | Active-section dot (scale-0 → scale-100 classes, or GSAP) |
| `[data-menu-toggle]` › `[data-toggle-label="menu|close"]`, `#mobile-menu[data-menu-panel]`, `[data-menu-mask]` › `[data-menu-link]` | Mobile menu clip/stagger (the panel uses the `hidden` attr right now; focus trap, Esc, `inert` and scroll lock are done in `SiteHeader.tsx`) |
| `[data-preloader]` (rendered `hidden`), `[data-preloader-logo|counter|fill|label|edge]` | Preloader timeline §5.1; remove `hidden` to show it |
| `.cursor` › `.cursor-disc` (104px, scale 0.096) › `.cursor-label` | Custom cursor; shown only when `.has-cursor` is on `<html>` |
| `[data-cursor="view|link|hide"]`, `[data-cursor-label]` | Cursor states (cards = view, wordmark = hide, links/buttons = link) |
| `[data-magnetic]` (value = strength) › `[data-magnetic-inner]` | Magnetic: header CTA, hero CTA, footer email, footer button, Back to top |
| `.btn` › `.btn-fill` (reads `--x/--y`), `.btn-icon` (2 arrows) | Pointer-origin fill; a CSS version already runs from the centre |
| `[data-hero]`, `[data-hero-media] .frame` / `.frame-inner` | Arch clip reveal + scale 1.25 → 1; parallax yPercent |
| `h1[data-anim="lines"]`, `[data-hero-headline]`, `[data-hero-fade]` | Line reveal, scroll scrub, fade-up group |
| `[data-scroll-cue-line]` | Looping scaleY |
| `g[data-shaft]` (in the hero SVG, transform-origin 580 240) | Pointer rotate ±2deg |
| `[data-pin-section="philosophy"]`, `h2[data-anim="words-scrub"]`, `[data-rule]`, `[data-anim="lines"]` | Pin + word scrub, rule scaleX, note lines |
| `[data-anim="window"]` (= `.frame`), `.frame-inner[data-speed]` | Window clip reveal and parallax (beam vignette + project cards) |
| `#work [data-pin]`, `[data-gallery-viewport]`, `ol[data-track]`, `li[data-card]` | Pin + track x. **Set `[data-gallery-viewport]` to `overflow: visible` while pinned** (it is `overflow-x: auto` now) |
| `[data-card-text]`, `[data-card-title]` | Card text fade-up, hover x 8 (a CSS hover already does this) |
| `[data-counter-mask]` › `[data-counter-current]`/`[data-counter-next]` | Counter digit swap |
| `[data-progress-fill]` | Gallery progress scaleX |
| `[data-process-sticky]`, `ol[data-steps]` › `li[data-step][data-step-index]`, `[data-step-content]`, `[data-tag]` | Active step triggers, content fade-up |
| `[data-numeral-mask]` › `[data-numeral-current]`/`[data-numeral-next]` | Giant numeral swap |
| `[data-step-label][data-active]` › `[data-step-dot]`, `[data-process-progress-fill]` | Label state, vertical progress scaleY |
| `svg[data-process-visual][data-mode="progressive"]` › `g[data-layer="listen|draw|choose|build"]` (stroke paths have `pathLength=1`, fills have `data-fill`) | Layer draw-on. The desktop instance renders activeStep=4 (earlier layers at 25%); the mobile instance is `composite` |
| `[data-anim="count"][data-count-to]` (sr-only final value next to it), `[data-stat-rule]`, `[data-stat-label]` | Count-up, rule scaleY, label fade |
| `li[data-award]` › `span[data-rule]`, `[data-award-text]` | Recognition rows |
| `h2#contact-title[data-anim="lines"]`, `[data-contact-fade]`, `[data-dusk]` | Footer reveals, dusk glow scrub |
| `[data-wordmark-mask]` › `p[data-wordmark][data-anim="chars"]` | Wordmark char scrub + hover lift |
| `[data-back-to-top]` | Native scroll now; swap in `lenis.scrollTo`, then focus `[data-logo]` |
| `[data-eyebrow]` / `[data-anim="fade-up"]` | Generic fade-up |

### Deviations
- **Font variables** are `--font-instrument` / `--font-hanken`. Tailwind maps them to `--font-serif` / `--font-sans`, which avoids a self-referencing variable.
- **MediaFrame**: the clip target is the inner `div.frame` (with `data-anim="window"`), not the `<figure>`. That keeps `<figcaption>` outside the clip. The ProcessVisual frame uses `.frame-inner--flush` (no 116% bleed) so its swatch labels are not cropped.
- **Hero headline** at lg uses `min(--text-hero, (100svh − 470px) / 2.76)`. Eyebrow padding-top is 120px and headline padding-bottom is 48px, so all 3 lines fit at 1440×900. The arch height is `max(100svh,760px) − 240px`, which leaves room for the caption above the meta row.
- **Gallery cards** at md+ are sized by height: `--card-h: clamp(…, 100svh − 580px, 492/640px)`, width = h × 13/16. The card 2/4 offset is `clamp(0, 100svh − 840px, 64px)`, so the pinned view fits the viewport. The type · place line is left out of the card text but stays in the aria-label.
- **Wordmark** uses `--text-wordmark: calc(var(--content-w) * 0.238)` instead of 15.6vw. In Instrument Serif, 15.6vw only covers about 70% of the content width.
- **ProcessVisual / SVG ids**: layers use `data-layer` instead of `id="layer-*"`, and gradient ids are prefixed, because the visual renders twice (desktop and mobile). The filters `#grain`, `#soften`, `#soften-sm` and `#haze` are defined once in `<Grain/>` in the layout.
- **Sun path** (`[data-sunpath]`) has no `pathLength=1`, because its 4/6 dash pattern would break. Fade it in instead.
- **Header colour** stays ink until ANIM sets `data-header-theme`, so the logo and nav sit on dark sections without contrast in the static build.
- **OG image** uses the default serif: Instrument Serif is not embedded in ImageResponse. The Privacy link points to `#privacy` (placeholder).
- **Mobile menu** focus trap covers the whole header, so the Close toggle stays reachable.

---

## Implementation notes (animation agent)

All motion lives in `src/animations/`. Three client components are mounted in `src/app/layout.tsx`: `<SmoothScroll>` wraps the page, and `<PageMotion/>` (renders nothing) sits after `<Preloader/>` and `<Cursor/>`. The section components stay server components.

### Files
| File | What it does |
|---|---|
| `gsap.ts` | Registers `ScrollTrigger`, `SplitText` and `useGSAP` once. Holds the defaults (`expo.out`, 0.9s), the `MQ` matchMedia conditions (isDesktop / isMobile / isPinGallery / reduce), `CURSOR_MQ`, `fontsReady()` (fonts.ready with a timeout), and the `$` / `$$` helpers. |
| `SmoothScroll.tsx` | Lenis provider plus `useLenis()`. A module singleton is reachable through `getLenis()`. Lenis is bridged to the GSAP ticker and `ScrollTrigger.update`, with `lagSmoothing(0)` and `autoRaf: false`. It is created once and destroyed on unmount, and is never created for reduced motion (it is also dropped if that preference turns on at runtime). Anchor clicks go through `scrollTo` (1.6s expo.out, focus moves to the target). `lockScroll` / `unlockScroll(reason)` stop Lenis for the preloader and the menu, and work even before Lenis exists. `scrollToTarget()` and `expoInOut` are exported too. |
| `PageMotion.tsx` | Orchestrator. The preloader runs in its own `useGSAP`. Every section timeline is built in a second `useGSAP`, after fonts are ready (so SplitText measures real glyphs), inside one `gsap.matchMedia`. A second `mm.add(CURSOR_MQ)` sets up the cursor. It refreshes on `fonts.loadingdone` and on `load`. Everything is reverted on unmount: tweens, splits, triggers, pins and listeners. |
| `intro.ts` | Promise bus between preloader and hero: the hero waits on `whenIntro()`, which the preloader fires at t = 2.95s. |
| `split.ts` | `lineReveal()` (masked SplitText lines; the split is reverted when the reveal ends, and triggers re-measure if the height changed), `fadeUp()`, and `createDigitSwap()` (two-span roll used by the gallery counter and the process numeral). |
| `cursor.ts` | Custom cursor: quickTo position; GSAP scales a fixed 104px disc (0.096 / 0.423 / 1 / 0); colours come from CSS via `.cursor[data-state]`; label in/out, press ×0.85, fades out when the pointer leaves the window. Also: magnetic `[data-magnetic]` (+24px pad, inner ×0.15, `elastic.out(1, 0.45)` return, cursor snaps 40% toward the centre), and the pointer-origin `--x/--y` for `.btn-fill`. |
| `timelines/preloader.ts` | §5.1 timeline as specified. The counter holds at 90 until fonts are ready (computed on the power2.inOut curve). It sets `inert` on `<main>`, scrolls to top, writes sessionStorage `la-loaded`, and has a 7s safety that completes it. Reduced motion: the logo shows for 0.4s, then a 0.3s fade. |
| `timelines/hero.ts` | Arch clip-path reveal + inner scale 1.25 → 1; masked line reveal (`em` line skew); fade group (eyebrow, lead, CTAs, meta, caption); scroll-cue loop; scroll-out scrub; pointer-driven shaft rotate (desktop). The entrance plays only once, even when matchMedia rebuilds. |
| `timelines/philosophy.ts` | Word scrub (opacity 0.14 → 1, stagger 0.1, accent words graphite → terra). Desktop pins the section for +150%. Also: eyebrow, rule scaleX, note line reveals, beam window reveal. |
| `timelines/projects.ts` | ≥768px: pins `[data-pin]` and moves the track on x. While pinned, the viewport is set to `overflow: visible` and its `tabindex` is removed; both are restored on revert. Per card, via `containerAnimation`: window clip, inner xPercent parallax, text toggle. Progress scaleX and counter come from the pin's `onUpdate`. Keyboard: `focusin` on a card scrolls the page to the position that shows that card. <768px: vertical window reveal + yPercent parallax. |
| `timelines/process.ts` | Desktop: step triggers (`top 55%`) drive the numeral roll, the label dots and the progressive ProcessVisual (dashoffset draw, fills scale/fade, earlier layers at 25%, later ones undrawn when scrolling back), plus a scrubbed progress line. Mobile: the composite visual draws all layers once, 0.4s apart. Step content fades up at every size. |
| `timelines/stats.ts` | Count-up from server-rendered finals (zeroed just before tweening, restored on revert), rule scaleY, label fade, recognition rows. |
| `timelines/footer.ts` | Headline lines, fade group, dusk glow scrub, wordmark char rise (scrub 0.8, from centre), desktop hover lift + clay tint. |
| `timelines/page.ts` | `themeTween()` (`.js-theme` + body `--page-bg/--page-fg`); `headerTimeline()` (`data-header-theme` at `top 44px`, active nav dot + `aria-current`, hide on scroll down after 120vh but never while the menu is open or focus is in the header). |
| `timelines/parallax.ts`, `timelines/shared.ts` | Generic `data-speed` parallax; shared window clip values and `windowReveal()`. |

Edited components: `MobileMenu.tsx` (Framer Motion `AnimatePresence`: clip wipe, masked link stagger, opacity-only when reduced), `SiteHeader.tsx` (Menu ↔ Close label roll, menu scroll lock), `BackToTop.tsx` (Lenis 2.2s expo.inOut, then focus the logo), `Cursor.tsx` (GSAP now owns the transforms), `ProjectCard.tsx` (title transitions `translate` only, so the CSS hover does not fight the GSAP reveal transform). `globals.css` gets a final "Animation layer" block.

### No-JS / failure safety
An inline `<head>` script (`bootScript` in layout, `suppressHydrationWarning` on `<html>`) adds `js js-intro`, plus `js-preload` on the first visit, before first paint. CSS hides only the hero's entrance elements under `js-intro` and shows the preloader under `js-preload`. If `PageMotion` has not added `anim-ready` within 3s, the script removes those classes. `PageMotion` also has an 8s fallback that removes `js-intro`. Every other initial state is set by GSAP at runtime, so without JS everything is visible.

### Deviations
- **Parallax amplitudes are clamped to 6%** of the 116% inner: hero 6 (mobile 3), cards ±6, beam derived from `data-speed`. The inner bleeds only 8%, so the spec's 12 / ±8 / ±10 would show the frame edge.
- **Gallery counter** maps the pin progress onto 01–05 rather than "card centre crosses viewport centre". The last card can never reach the centre because the track ends there, so 05 would never show.
- **Last card's window reveal** ends at `max(45%, the card's final left + 3%)`, so it always fully opens before the pin ends.
- **Philosophy pin** is triggered by the statement: `center center`, or `top 12%` when the statement is taller than 80% of the viewport (it is at 1440×900). This keeps the whole statement in view while pinned.
- **Wordmark and dusk scrubs** end at `"max"` (the page bottom) instead of `bottom bottom`. This holds even when content above reflows.
- **Reduced motion:** the desktop ProcessVisual shows the code agent's static step-4 state (earlier layers at 25%) rather than the 40% composite. Pills keep the CSS press `scale: 0.97` instead of a Framer `whileTap`, because Button stays a server component. Card hover stays CSS.
- **Header CTA:** no transition delay, so its label never blinks ink-on-ink when the header theme flips.

### Verified
`npm run lint` and `npm run build` are clean. Prod server on :3111 with Playwright at 1440×900 and 390×844 (deviceScaleFactor 1), plus `reducedMotion: 'reduce'` at both sizes:
- No console errors and no horizontal overflow at any scroll step.
- Nothing left invisible at the end of the page. The only flagged element is the hero h1 at its intended 0.2 scroll-out opacity.
- Reduced motion: no Lenis, no pins, all content visible.
- Interactions work: mobile menu, anchor scroll with focus move, keyboard focus on card 5 brings it on screen, "View" cursor, magnetic CTA.

---

## QA notes

Fixes made after QA (prod build, Playwright at 1440×900, 1024×768 and 390×844, plus reduced motion and JS disabled):
- **Header:** it now hides on scroll down from about 80px (`min(10vh, 80px)`) instead of 120vh. Once content is beneath it, it takes the surface of the section under it (`data-scrolled` + `data-header-surface`: bone, linen or ink). It stays transparent while the menu is open. Without the motion layer (no JS / reduced motion) it is always solid. Before this, the nav sat on top of the hero copy and the process and footer text.
- **SplitText line reveals:** responsive `<br class="hidden lg:inline">` are removed before splitting and restored on revert. Below lg they had forced extra lines, and the heading reflowed when the split reverted (CLS 0.04–0.09). Split elements get `display: flow-root`, so their height is the same split and unsplit. This stops every reveal from forcing a `ScrollTrigger.refresh()`.
- **Focus kept across `ScrollTrigger.refresh()`:** the pin revert moved focus to `<body>` while tabbing through the gallery, which skipped cards 4–5 and the footer.
- **Tab order:** fade-ups that contain links (footer group, gallery end card, generic `fadeUp`) now tween `opacity` rather than `autoAlpha`, so `visibility: hidden` no longer drops those links from the tab order before they have been revealed.
- **Reduced motion:** the mobile "Close" label kept its server-rendered `y: 100%` offset. The reduced variant now sets `y: 0`.

### Mobile performance pass
Measured with Playwright (Pixel 7 / iPhone 13, CPU ×4, real CDP touch events):
- **Lenis is skipped on touch devices** (`(hover: none) and (pointer: coarse)`). With `syncTouch: false` it never smoothed touch anyway. It did add non-passive window touch listeners and rewrote the `<html>` class at each scroll start and stop. Anchor clicks still get an eased scroll there (native smooth), and `lockScroll` falls back to `html.scroll-locked` (overflow hidden).
- **Theme tween** now tweens body `background-color` only. Tweening the inherited `--page-bg/--page-fg` restyled all ~900 elements on every frame, which caused every long task while scrolling. Body `color` switches once per section, since each section sets its own text colour. The cursor gets `--page-fg` on its own subtree.
- **No permanent `will-change` on `.split-word`.** That was 44 compositor layers re-layerized on every scrub frame.
- **The grain overlay has no `mix-blend-mode` on touch devices**, so the full screen is not blended on each frame. Its opacity is 0.035.
- **Philosophy mobile scrub range** is now `top 88%` → `bottom 30%`, about 700px (was about 490px). Words light up while the statement is on screen instead of finishing in one flick.
- **`PageReady`** (rendered last in `page.tsx`) gates `PageMotion`. GSAP must never split DOM that the page segment has not hydrated yet: that causes React #418, and React then throws the split DOM away.
