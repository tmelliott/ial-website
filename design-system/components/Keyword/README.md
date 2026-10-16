# Keyword

A compact outlined tag (`KeywordButton`) linking to a keyword page. Also the standard for every small tag link, including those in the action cards.

- **Size:** padding `space-1` × `space-2`; text `small`. Use `caption` for `sm` and `lead` for `lg`.
- **Light:** `gray-600` label, `gray-500` border; on hover the fill is `gray-200` and the label `gray-800`.
- **Dark:** `gray-300` label, `gray-500` border; on hover the fill is `gray-500` and the label `white`.
- **Rows:** `space-2` gap, wrapping.
- **You supply:** `title`, `slug`, and optionally `size` and `variant`.

Static rendition, hand-written from `site/src/components/projects/KeywordButton.astro`. The border is `gray-500` here; the code uses `gray-400`, which is too faint.
