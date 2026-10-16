# Input

A text field from the contact form.

- **Field:** `radius`, `border-width` `gray-500` border, padding `space-2` × `space-4`, text `body`.
- **Focus:** the border turns `accent-600` with a 3px `accent-200` ring; no browser outline.
- **Label:** `label` style, `space-2` above the field.
- **You supply:** a label, name and type.

Static rendition, hand-written from `site/src/components/pages/ContactForm.tsx`. The code uses a `gray-400` border, which is 2.6:1 on white; `gray-500` reaches the 3:1 a control border needs. Likewise, the code's focus border is `accent-300` (1.9:1); `accent-600` (4.55:1) makes focus visible.
