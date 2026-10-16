# Button

The site's one button (`ButtonLink`): an outlined link that fills on hover.

- **Size:** padding `space-2` × `space-4`, at least `tap-target` (44px) tall; text `body`.
- **Shape:** `radius`, `border-width` border, `shadow-card`.
- **Variants:**
  - **primary** (default): `accent-stripe` border with `accent-text` label (6.2:1); on hover it fills `accent-fill` with `white` text. The code's `accent-600` label is 4.55:1, too close to the line.
  - **secondary**: `black` text and border; on hover it fills `black`.
  - **alternate**: for dark grounds. `white` text and border; on hover it fills `white` with `black` text.
- **You supply:** `href`, a label, and optionally `type`.
- **Don't:** use pill corners, fill a button at rest, or use the small `px-3 py-1.5` size. Small links are Keyword chips.

Static rendition, hand-written from `site/src/components/ButtonLink.astro`. A filled variant, where one is needed, is `accent-fill` with `white` text, not `accent-50` on `accent-600`.
