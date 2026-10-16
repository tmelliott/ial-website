# Consolidation

How the site's values were reduced to the system above. The counts come from the Astro site (`site/src`, measured on `dev` at `9d0b72f`; `strapi-admin-trial` at `911a731` adds the new home hero and keeps the same patterns); the older Next.js pages in `src/app/(website)` repeat the same patterns. Each row lists what the code does now and what the system uses instead.

## Corners

| In the code | Uses | Becomes | Why |
|---|---|---|---|
| `rounded` | 52 | `radius` | The standard: every card, button, chip and input |
| `rounded-lg`, `rounded-*-lg` | 3 in site, 7 in the Next.js pages | `radius` | The about-page cards were the only larger corner |
| `rounded-full` | 5 | `radius-full` | Kept: avatars and accent bars |

## Shadows

| In the code | Uses | Becomes | Why |
|---|---|---|---|
| `shadow`, `shadow-sm` | 26 + 8 | `shadow-card` | In Tailwind 4 these are the same shadow already |
| `shadow-md` | 1 | `shadow-raised` | Kept for hover lift only (about cards) |
| `shadow-lg` on header and menu | 2 | `shadow-overlay` | Kept: these float above the page |
| `shadow-lg` on team photos (`OurTeam`) | 1 | `shadow-card` | An image in the page is not an overlay |

## Spacing

| In the code | Where | Becomes |
|---|---|---|
| `px-3 py-1.5`, `px-3 py-2` | Tag links in the three ActionCards, apps page | Keyword chip: `space-1` × `space-2` |
| `py-2 px-4 min-h-11` vs `py-2 px-4` | Card button vs ButtonLink | Button: `space-2` × `space-4`, min `tap-target` |
| `py-2 px-4 md:py-4 md:px-6` | PersonCard body | Card: `space-4`, `space-8` at lg |
| `p-6` | About cards, OurCollab cards | Card: `space-4`, `space-8` at lg |
| `gap-3` | ActionCard chip rows | `space-2` (matches the other chip rows) |
| `gap-10`, `lg:mb-10`, `lg:pb-10` | Home Data section, PageHeader | `space-12` |
| `gap-16` | Footer | `space-12` |
| `mb-20` | PageHeader | `space-24` |
| `lg:pb-32`, `lg:pb-38` | 404, project page, footer | `space-24` / `space-36` |
| `px-3`, `py-3`, `px-6` | MainMenu items | `space-2` / `space-4` |
| `pb-60`, `lg:pb-80`, `mt-80`, `lg:-mt-40` | Home scroll choreography | Not spacing: left as layout |

## Neutral colours

| In the code | Uses | Becomes | Why |
|---|---|---|---|
| `text-gray-400` (meta text on white) | 6 | `gray-500` | 2.6:1 is too faint for text; `gray-500` is 4.8:1 |
| `border-gray-400` (inputs, chips) | 12 | `gray-500` | Control borders need 3:1; `gray-400` is 2.6:1 |
| `text-gray-700` | 6 | `gray-600` | Two near-identical secondary greys; one is enough |
| `text-gray-500` (meta) | 3 | `gray-500` | Kept |
| `bg-gray-50`, `border-gray-100` | 5 | `gray-100` | One subtle step |
| `text-gray-400/70`, `bg-gray-400/40` | AppCarousel controls | `gray-500` | Carousel arrows and dots; use the solid token |
| `focus:border-accent-300` | ContactForm (5 fields) | `accent-600` | 1.9:1 on white; focus must be visible (3:1) |

## Accent and secondary colours

| In the code | Where | Becomes | Why |
|---|---|---|---|
| `text-accent-600` on light | 17: buttons, card links, news labels, prose links | `accent-text` (`accent-700`) | 4.55:1 on white, 4.0:1 on `#F0F0F0` and `gray-100`; `accent-700` is 6.2 / 5.5:1 |
| `text-accent-500` on dark | Footer labels, CTAs, PageHeader links, team iwi line | `accent-text-on-dark` (`accent-400`) | 3.5–3.6:1 on wine or graphite; `accent-400` is 4.6:1 or better |
| `text-accent-400` on dark | Menu, news, Landing | `accent-text-on-dark` | Kept: already passes |
| `bg-accent-600 text-accent-50`, `bg-accent-600 text-white` | Filled buttons, the Landing badge, pagination | `accent-fill` (`accent-700`) with `white` | 4.2–4.55:1 on 600, and the badge is 11px; 6.2:1 on 700 |
| `bg-accent-600` stripe, `border-accent-600` | About cards, button outlines | `accent-stripe` | Kept: non-text needs 3:1 |
| `--color-secondary-*` (green) | Defined only, never used | Removed | Not part of the site's look |
| `#2e3033`, `#3c3c40` | Home hero gradient and data ramp | `graphite-900`, `graphite-800` | Promoted to the secondary colour |
| `#F0F0F0` | Section fades on 5 pages | `surface-alt` | Named so it stops being a hard-coded value |
| `#3c3c40 #6a3a40 #b3202c #f73c49 #ffd0d4` | `HeroStage` ramp | `data-1` … `data-5` | The brand's data palette |

## Dark backgrounds: wine → graphite

| In the code | Where | Becomes |
|---|---|---|
| `--color-bg-gradient-end: #63121f` | PageHeader, ContactShell, team, project, news, 404 and apps headers; the CTA radial glow | `#2e3033` (`graphite-900`): one change in `global.css` fixes all of these |
| `card-gradient-feature` (`… #63121f 125.61%`) | Action cards, featured keyword and project groups | `#2e3033`; now the same as the home hero |
| `card-gradient-dark` (`#430e17 12.8% …`) | Featured project cards | `#2e3033 12.8%` |
| `from-black to-accent-950` | Featured news cards (home and news) | `from-black to-[var(--color-bg-gradient-end)]` |
| `bg-accent-900/95` | Dropdown menu (`MainMenu`) | `bg-[var(--color-bg-gradient-end)]/95`, i.e. `graphite-900`; items still hover to `accent-fill` |
| `card-gradient-bright` | Bright action cards | Kept: the one red background, used as a callout |

## Sections

| In the code | Where | Becomes |
|---|---|---|
| `CTA.tsx`: a `bg-gradient-end` radial glow that follows the mouse, hydrated with `client:visible` | Home OurCollab and OurWork, project and page CTAs | **CTA band**: still, `bg-gradient-start` → `bg-gradient-end`, with a graticule and dot-plot background on the right; a plain `.astro` component |
| `text-accent-500` phrase, `text-3xl` alternate button | Same | `accent-text-on-dark` phrase; alternate button at 20px under the copy |
