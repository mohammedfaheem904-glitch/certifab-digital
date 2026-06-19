## Goal
Swap the current placeholder brand mark (Lucide `Flame` icon in a gradient square) for the uploaded "weld yard" logo everywhere it represents the app brand, and set it as the browser favicon.

## Asset setup
- Upload `user-uploads://image.png` to Lovable Assets and save the pointer at `src/assets/weld-yard-logo.png.asset.json` (so the image isn't committed as a binary).
- Also copy a square-cropped favicon-friendly copy to `public/favicon.png` (just reuse the same PNG — browsers handle non-square) and remove any default `public/favicon.ico` reference.
- Create a small `<Logo />` component in `src/components/Logo.tsx` that renders the image with proper `alt="Weld Yard"`, fixed height, `width:auto`, and accepts a `size` prop (`sm` for header/sidebar ~28–32px, `md` for auth pages ~48px). This keeps aspect ratio consistent and makes future swaps trivial.

## Replacements (brand logo locations)
Replace the existing `<div class="size-… bg-[image:var(--gradient-primary)]"><Flame/></div>` + adjacent "Weld Yard / DWMS" text block with `<Logo />`:
1. `src/components/MarketingShell.tsx` — header brand link and footer brand block.
2. `src/components/AppLayout.tsx` — sidebar brand block.
3. `src/routes/login.tsx` — auth card header.
4. `src/routes/signup.tsx` — auth card header.
5. `src/routes/accept-invite.tsx` — auth card header.
6. `src/routes/app.index.tsx` — only if a brand header exists (verify; otherwise leave the `Flame` as a decorative dashboard icon).

The new logo image already contains the "weld yard" wordmark, so the separate "Weld Yard / DWMS" text next to the mark will be removed where the wordmark is shown (header, footer, auth pages). In the collapsed sidebar, use just the icon area of the logo at small size.

## Not changed (Flame stays — decorative, not brand)
- `verify.weld.$token.tsx`, `verify.instrument.$token.tsx` — page-section icons
- `app.procedures.$procedureId.tsx`, `HeatInputCalculator.tsx`, `ApprovalScreen.tsx`, `discovery/CommandPalette.tsx` — UI affordances unrelated to branding

## Favicon
- Update `index.html` `<head>` with `<link rel="icon" type="image/png" href="/favicon.png" />`.
- Keep title/meta unchanged.

## Theme considerations
The logo's mark is black + yellow on transparent background, and the wordmark is dark. On the dark marketing/app surfaces, dark text will not read. Two options for handling dark backgrounds:

- A. Single-asset approach: always render on a subtle light chip (`bg-card` rounded container) so the dark wordmark stays legible on both light and dark surfaces.
- B. Two-asset approach: generate a light-variant PNG (white wordmark, same mark) via image-edit, and swap based on `dark:` class.

Default plan: option A (single asset, neutral chip background) — fastest, no extra asset generation, preserves the exact uploaded artwork. If you'd prefer option B, say so and I'll generate a light variant during build.

## Verification
- Visually check header, footer, login, signup, sidebar on desktop and mobile widths via the preview.
- Confirm favicon loads (network tab).