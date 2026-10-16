# iNZight Analytics

Analytics, research, and data visualisation that make a difference.

> **About this folder.** This is the website's design system: the brand book (this file), the tokens, and reference previews.
>
> - `tokens.json` is the source of truth. `tokens.css` is generated from it and exposes every token as a CSS custom property (`var(--accent-text)`, `var(--space-8)`, …), plus a class for each type style.
> - `consolidation.md` lists each stray value in `site/src` and the token that replaces it. Use it as the to-do list for bringing the code in line.
> - `components/<Name>/README.md` holds the guidelines for each building block. `preview.html` is a static rendition you can open in a browser.
> - `assets/logos/` holds copies of the marks.
>
> The tokens are mapped into the `@theme` block in `site/src/styles/global.css`: colour role tokens (`text-accent-text`, `bg-graphite-900`), shadows (`shadow-card`), type styles (`text-display`, `text-heading-sm`, `text-small`) and `--container-content`. Spacing, radius and the neutrals are Tailwind's defaults. `site/src/styles/theme.test.ts` fails if the theme and `tokens.json` drift apart. The CTA band is `site/src/components/CTABand.astro`.

This is the visual language of the iNZight Analytics Ltd website, taken from this repository (branch `strapi-admin-trial`, commit `911a731`). It covers colour, type, spacing, corners, elevation and the logo. Every value here is one the code already uses. Where the site uses several values for the same job, the system keeps the one that is used most and works best, and **Consolidation** lists what each stray value becomes.

## Colour

The site is **black and white with red accents**. Graphite is the one secondary, and a five-step ramp is kept for data.

- **Body** is `black` text on a `white` page. `surface-alt` (#f0f0f0) is the quiet alternate section background.
- **Accent (red), `accent-50` … `accent-950`** is the brand colour. The scale is unchanged. What matters is which step goes on which ground, so use the **role tokens** rather than picking a step:

  | Role | Light grounds (white, `surface-alt`, `gray-100`) | Dark grounds (black, graphite, gradients) |
  |---|---|---|
  | Accent text and links | `accent-text` → `accent-700` (6.2:1 on white, 5.5:1 on `surface-alt`) | `accent-text-on-dark` → `accent-400` (4.6:1 or better) |
  | Hover | `accent-text-hover` → `accent-800` | `accent-text-on-dark-hover` → `accent-300`, or `white` |
  | Solid fill behind white text | `accent-fill` → `accent-700` (6.2:1), hover `accent-fill-hover` | same |
  | Stripes, icons, focus borders (non-text) | `accent-stripe` → `accent-600` | `accent-500` |

  `accent-600` and `accent-500` stay as the brand reds, for fills, marks and data, but **never as text**. `accent-600` passes on pure white only by a hair (4.55:1) and fails on `surface-alt`; `accent-500` fails everywhere except black.
- **Secondary: graphite.** `graphite-900` (#2e3033) and `graphite-800` (#3c3c40) come from the new home hero. Graphite is now **the** dark ground: every dark gradient runs from black into graphite (`bg-gradient-end` points at `graphite-900`). **No wine or deep-red backgrounds.** Red is reserved for accents, text, stripes and the bright callout, so it stays loud against black, white and graphite.
- **Data ramp, `data-1` … `data-5`:** graphite → dark red → red → brand red → pale pink, from the hero's population chart. It is a sequential ramp: use it in order for low-to-high values. On white, start the ramp at `data-1`. On dark grounds, the light end (`data-4`, `data-5`) carries the highlights.
- **Neutrals** are Tailwind's gray, cut down to six steps, one job each:
  - `gray-200` for hairlines;
  - `gray-500` for control borders and meta text;
  - `gray-600` for secondary text on white;
  - `gray-300` for muted text on dark grounds.
  
  `gray-400` is gone: as text or a control border on white it is 2.6:1, too faint to read or see.
- **Logo colours** (`logo-red`, `logo-red-dark`, `logo-ink`) belong to the marks only.
- **The sage-green secondary scale has been removed.** It was defined in the theme but never used anywhere on the site.

### Gradients

The site uses these gradients. They are CSS, not tokens, so they are recorded here as written in the code:

| Utility | Gradient | Use |
|---|---|---|
| `card-gradient-dark` | `linear-gradient(61.89deg, #2e3033 12.8%, #000000 71.53%)` | Dark cards; text `white`, links inherit. Was `#430e17` (wine) |
| `card-gradient-feature` | `linear-gradient(329.6deg, #000000 15.91%, #2e3033 125.61%)` | Feature panels, action cards and heroes; text `white`. Now identical to the home hero (`HeroStage`). Was `#63121f` (wine) |
| `card-gradient-bright` | `linear-gradient(194.91deg, #e83150 6.25%, #c42943 96.96%)` | Bright red callouts; white text at 24px or larger only (4.2:1 at the light end) |
| `card-gradient-white` | `linear-gradient(180deg, #ffffff 0%, #fcfcfc 100%)` | Light cards on white |

Page headers, CTAs, the 404 and apps pages use the same pair as a Tailwind gradient, `from-[var(--color-bg-gradient-start)] to-[var(--color-bg-gradient-end)]`, so they turn graphite when the token changes. Dark grounds are always black fading into graphite: never wine, blue or purple. The only red background is `card-gradient-bright`.

## Type

One family: **Inter** (Google Fonts, weights 400, 500, 600 and 700), with `ui-sans-serif, system-ui, sans-serif` as fallback. It is a hosted face, so no font files are shipped with this system. Load it from Google Fonts.

- Headings are **regular weight (400)** and large, with `leading-tight` (1.25): `display-xl` for the home hero, `display` for page titles, then `heading-xl` → `heading-md` as sizes step down on small screens. The size does the work, not the weight.
- Weight 600 (`heading-sm`, `label`) is for card titles, buttons and small labels.
- `small` (14px) is the most used size on the site: card excerpts and metadata. `body` (16px) is the reading size; `.prose` is pinned to 1rem.
- The sizes are Tailwind's default scale; the style names here are this system's labels for how the site uses them.

## Spacing

A 4px base and eight steps. Nothing in between: if a value isn't on this list, round to the nearest step.

| Token | px | Use |
|---|---|---|
| `space-1` | 4 | Chip vertical padding, icon gaps |
| `space-2` | 8 | Button vertical padding, chip horizontal padding, chip-row gaps |
| `space-4` | 16 | Card padding (small screens), button horizontal padding, small gutter |
| `space-6` | 24 | Spacing between blocks inside a card at lg |
| `space-8` | 32 | Page gutter, card padding at lg, page-header padding, medium gutter |
| `space-12` | 48 | Large gutter, space under a page title, mobile section padding |
| `space-24` | 96 | Section padding, gap between a page's two main columns |
| `space-36` | 144 | Hero sections at lg only |

**Gutters step up with the screen:** `space-4` → `space-8` → `space-12` (`gap-4 sm:gap-8 lg:gap-12`). Content sits in a `container-content` (72rem) column with a `space-8` gutter.

## Corners and elevation

- **One radius.** `radius` (4px) on every card, button, chip, input, menu and image. `radius-full` only for avatars and the thin accent bars. The look is crisp and squared-off, never pill-shaped.
- **Three shadows, by height:**
  - `shadow-card` for anything resting on the page: cards, buttons, avatars, page headers.
  - `shadow-raised` for a clickable card on hover.
  - `shadow-overlay` for what floats above the page: the sticky header and dropdown menus.
- **Borders** are always `border-width` (1px). The accent stripe is `stripe-width` (4px) of `accent-stripe`, `accent-500` on dark grounds.

## Building blocks

These are the best existing examples in the code, written down as the standard:

- **Button** (`ButtonLink`): padding `space-2` × `space-4`, at least `tap-target` (44px) tall, `radius`, 1px border, `shadow-card`. There are four variants:
  - **primary**: `accent-stripe` border with `accent-text` label; on hover it fills `accent-fill` with white text. For a filled button, use `accent-fill` with `white` text, never `accent-50`.
  - **secondary**: `black` outline; on hover it fills black.
  - **alternate**: `white` outline for dark grounds.
- **Keyword chip** (`KeywordButton`): padding `space-1` × `space-2`, `radius`, 1px `gray-500` border, `gray-600` label (`small`). On hover the fill is `gray-200` and the label `gray-800`. On dark grounds the label is `gray-300` with a `gray-500` border. The tag links in the action cards use this same chip.
- **Card**: `white`, `radius`, `shadow-card`, clipped corners. Padding is `space-4`, rising to `space-8` at lg. A clickable card lifts to `shadow-raised` on hover. A dark (featured) card uses `card-gradient-dark` (graphite) with `white` text.
- **Dropdown menu**: `graphite-900` at 95% with a blur, `radius`, `shadow-overlay`, and a 1px `white`/10% border. Items hover to `accent-fill` with `white` text.
- **Input** (`ContactForm`): `radius`, 1px `gray-500` border. On focus the border turns `accent-600` with an `accent-200` ring.
- **Page header**: dark gradient from `bg-gradient-start` to `bg-gradient-end`, padding `space-8`, `shadow-card`, `white` text, links in `accent-text-on-dark`.
- **CTA band**: a full-width black → graphite band, 384px tall. The copy and an alternate button stack on the left; on the right, a still background in faint white. There are four variants: `map` (a Pacific world map in dots, with partner locations marked) for "Work with us"; `hexheat` (a hexagon heatmap fading in from black to red) for projects; `ui` (a faint app wireframe) for the apps page; and `grid` (the header's lat/lon grid) as the plain option. The decoration fades in from the right, so nothing sits under the copy. See the CTA notes for the contrast limits.

## Logo

Two marks live in `assets/logos/`:

- `ial-logo.svg`: the full lockup. A dot plot sits over a boxplot whose whisker underlines the lowercase wordmark "inzight analytics", with "nz" in red. Its wordmark is near-black (`logo-ink`), so use it on white or light grounds only.
- `ial-mark.svg`: the 32 × 32 favicon mark. Twelve red dots stacked as a dot plot. Use it where the lockup won't fit: favicons, avatars and small badges.

The dot plot is the brand's one motif: data, shown plainly. Never redraw, recolour or reflow the marks.

## Not synced

- **No dark-ground logo.** The repository has only the black-ink lockup (`public/IAL_logo_transparent.ai` is an Illustrator file and was not brought in).
- **Patterns** (`ial-chain`, `ial-circles`, `ial-crosses`, `ial-signal`, `ial-weave` in `src/app/(website)/components/Patterns/`) were not imported. They are brand decoration you may want later.
- **Components** are documented as building blocks above and shown as static previews. They are not a live component library, because the site's components are Astro templates, not React.
- **`font-display`** is used on headings in the Astro site, but the theme no longer defines it (the older Next.js theme had it commented out as Inknut Antiqua). Headings currently render in Inter.
- **`--ourwork-transition-offset`** (460px) and the large one-off offsets on the home page (`pb-60`, `mt-80`, `-mt-40`) choreograph scroll effects. They are layout, not spacing, and stay out of the scale.
