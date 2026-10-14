# CTA

The full-width call-to-action band between landing-page sections ("Got an idea for a project? Work with us. [Contact us]"). It replaces the mouse-following red glow in `CTA.tsx` with a still background that shows what the company does. A `variant` prop picks the background.

- **Ground:** `bg-gradient-start` → `bg-gradient-end` (black to graphite) at 100°, black for the first 35% so the copy always sits on the darkest part. Height 384px from md up (`md:h-96`).
- **Copy, left-aligned and stacked:** one line in `heading-lg` (30px) `white`, with the second phrase in `accent-text-on-dark`. Below it, `space-6`, the **alternate** button at 20px. The second phrase is optional. A description can go in the band's slot: it renders as `prose-invert` in `gray-300`, at most 52ch wide, between the line and the button. The band grows past 24rem if it needs to (the apps page uses this for its CMS text).
- **Decoration** sits on the right and fades in with a CSS mask, so nothing is drawn under the copy. It is all `white` at low opacity, apart from the partner dots in `map`.

## Variants

- **`map`, for "Work with us":** a Pacific-centred world map.
  - **Projection:** Equal Earth, centred on 160°W, showing roughly 108°E to 68°W and 47°S to 58°N, so Australia, Aotearoa and the Americas all fit in the band.
  - **Land:** a dot grid on a 6px pitch, `white` at 16%, from Natural Earth 1:50m (`world-atlas` `land-50m.json`). Aotearoa's dots are at 70% so home reads first.
  - **Graticule:** 15° lines at 9%.
  - **Partners:** each partner is an `accent-400` dot, 8px across (4.8:1 on graphite), joined to home by a great-circle arc in `white` at 28%. Home is an `accent-500` dot with a ring.
  - **Partner list:** a list of `{ name, lon, lat }` you maintain, for example on the `homeCollaborators` global next to `type`. The dots in the preview (Sydney, Melbourne, Brisbane, Vancouver, Seattle, San Francisco) are demo data only.
  - **Mask:** the map is wider than the others, so its fade runs from 38% to 56% of the width.
- **`hexheat`, for projects:** a full-width hexagon heatmap that builds from solid black, through faint outlines, to red-filled cells on the right. See [CTAHex](../CTAHex/README.md). It replaced `mark` (the logo dot plot scaled up), which has been removed.
- **`ui`, for apps ("Want better apps?"):** a faint wireframe of an app on the right. A window bleeds off the bottom and right, with a sidebar (one active item) and a toolbar holding a dropdown, a segmented control and a toggle. The content area has a dot-plot panel (the logo's motif), a slider and two stat tiles, and a small dialog overlaps the window's left edge with a cursor over its button. Everything is `white` outlines and fills at about 3–12% (the layer is at 70%). The only colour is the toggle's "on" track in `accent-500`. It uses the standard mask (42% → 70%). Source: `site/src/components/cta/UiArt.astro`. On a 390px phone, the slotted description in `gray-300` is at least 8:1 over the art.
- **`grid`, the plain option:** the header's own lat/lon grid. Reuse `graticulePaths(0)` from `lib/heroMorph.ts` with the hero's styles (5° lines at 9%, 1° crosses at 22%), cropped to the band (`viewBox="0 254 1440 384"`, `preserveAspectRatio="xMaxYMid slice"`).

Don't use the same variant in two neighbouring CTAs.

## Rules

- **Contrast:**
  - White text and the button stay at least 4.6:1 on any pixel.
  - `accent-text-on-dark` would fall below 3:1 on land dots, crosses and arcs, which is why the mask keeps the copy area clear.
  - Only layers at 9% or less may pass under the copy; that keeps it at 3.6:1 or better, enough for 30px text.
  - Partner dots are non-text marks and only need 3:1, which they meet.
- **Small screens:** keep the art right-anchored; it scales down behind the stacked copy. Below md, keep only the land dots, the partner dots and the dot plot; drop the arcs and crosses.
- **No motion.** The section is static. It needs no `client:visible` hydration, so it can become a plain `.astro` component. Pre-compute the `map` dots at build time (from `world-atlas` and `d3-geo`'s `geoEqualEarth`) rather than in the browser.

Static rendition. The `grid` variant uses the same projection as `site/src/lib/heroMorph.ts`; the `hexheat` cells come from `site/src/lib/ctaHex.ts`.
