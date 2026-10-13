# Card

The container for news, projects, people and actions.

- **Surface:** `white` with `radius` and `shadow-card`; content clipped to the corners.
- **Padding:** `space-4`, rising to `space-8` at lg. Use `space-6` between blocks inside the card at lg.
- **Hover** (clickable cards only): lifts to `shadow-raised`; the accent stripe deepens to `accent-700`.
- **Accent stripe** (optional): `stripe-width` of `accent-600` down the left edge; `accent-500` on dark cards.
- **Dark card:** `card-gradient-dark` (graphite to black, never wine) with `white` text; muted text `gray-300`, links `accent-text-on-dark`.
- **Text:** meta in `small` `gray-500`, title in `heading-sm`, excerpt in `small` `gray-600`.
- **Grids** of cards use gaps of `space-4` → `space-8` → `space-12`.

Static rendition, hand-written from `NewsCard.astro`, `ActionCard.astro` and the about-page cards.
