# JDPortfolio

Single-page portfolio: React 19 + Vite 8 + TypeScript 5.9 + Tailwind 4 (`@tailwindcss/vite`, theme in `src/index.css` `@theme`). pnpm only. Deployed on Netlify (`public/_redirects`).

- `pnpm dev` / `pnpm build` (runs `tsc -b`) / `pnpm lint` — build and lint must stay clean.
- Content lives in `src/data/` (`profile.ts`, `projects.ts`); components in `src/components/` only render it.
- UI state is a single zustand store in `src/store.ts`. No router: sections are anchors (`#home`, `#about`, ...).

## Background scene (`src/scene/`)
- `Scene.tsx` lazy-loads `controller.ts` after page idle; skipped for reduced motion, no WebGL2, or software GL
  (append `?forcegl` to force it, e.g. for headless screenshots).
- `engine.ts` render loop + pointer; `reveal.ts` + `shaders/` = trail mask and composite; `hiddenWorld.ts` = shapes.
- `physics.ts` (Rapier, 1 unit = 100 CSS px, viewport-centered, y up) loads on first user input.
  `textPhysics.ts` maps hero `[data-letter]` spans to bodies; glyphs stay DOM and are moved with transforms.
- Touch may only grab letters (never hidden objects) so scrolling keeps working.

## Conventions
- Mobile-first; no fixed pixel widths. Tap targets ≥ 44px (`min-h-11`).
- External links: `target="_blank" rel="noopener noreferrer"`.
- Project screenshots: WebP at 1200w plus a `-640.webp` variant (used via `srcset`).
