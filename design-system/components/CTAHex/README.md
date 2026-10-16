# CTAHex

The projects CTA background, replacing `mark`: a hexagon heatmap that runs the full width of the band. Left to right it goes from **solid black → dark grey hexagon outlines → red-filled cells**, so the band reads as a chart emerging from the dark. Same band, copy and button as [CTA](../CTA/README.md); this is the `hexheat` variant of `CTABand`.

- **Grid:** flat-topped hexagons with a 40px radius (about seven rows in the 384px band), columns every 60px, alternate columns half a row up, across the whole band. Cells are inset 0.8px, so filled neighbours nearly touch (a 1.6px seam) and no hard lines run through the red.
- **Outlines, on empty cells only:** a 1px `white` stroke at up to 9%, fading in with a smoothstep from 0% at the left edge to full by x = 420 (of 1440). Filled cells have no outline. There is no CSS mask; the left-to-right build-up is the gradient.
- **Fill:** each cell's value comes from a broad, smooth field (two sine terms with long wavelengths, so neighbours blend). It's multiplied by a smoothstep from 0 at x = 300 to 1 at x = 900, then by a 1.15 gain. Cells below 0.03 stay empty. The colour is the data ramp up to brand red (`data-1` graphite → `data-2` → `data-3` → `data-4`, at 82% of the ramp, with a 1.15 power), at 18–85% opacity. No pale pink.
- **Contrast:** outlines do pass under the copy, which is fine because they stay faint there. `accent-text-on-dark` is at least 5.1:1 on an outline pixel and white is at least 14:1. Fills begin at x = 300 but stay below about 35% opacity, in graphite tones, until well past the copy's 28ch measure. White text and the button stay at least 4.6:1 over the brightest cell.
- **Build:** `site/src/lib/ctaHex.ts` computes the cells from fixed field parameters when the page renders, with no randomness, so the art is identical every time. Its ramp is checked against `data-1` … `data-4` in `tokens.json` by `ctaHex.test.ts`. It's about 21KB of SVG. On wide screens, keep the same `preserveAspectRatio="xMaxYMid slice"` so the red stays on the right.
- **Small screens:** the stacked copy covers more of the band, so below md the band keeps CTA's fade (20% → 75%) and 55% opacity. Measured on a 390px phone, `accent-text-on-dark` is at least 6.2:1 behind the emphasis and white is at least 12:1.

Earlier candidates (`hexbin`, `hexhist`, a right-side-only `hexheat` with 16px cells, and versions with 2.5–3px gaps and 16% outlines) were dropped in favour of this one. The preview shows it with the fill starting at x = 380 and with the recommended x = 300.

Static rendition, generated in Python.
