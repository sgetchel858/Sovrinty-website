# Sovrinty — GTM website

The marketing site for **Sovrinty**, the governance and trust layer for
enterprise AI. A static site with **no build step** — plain HTML5 + CSS3 +
vanilla JS (ES modules), served as-is.

Two intertwined experiences, built from the same blocks:

- **A · The walkthrough** (`walkthrough.html`) — the demo made self-serve,
  scenes S0–S6 + close.
- **B · The problem doorways** (`problems/p0…p9-*.html`) — ten problems, each a
  short explainer. Every problem also appears as a moment in the walkthrough,
  and links back to it.

See `BUILD_SPEC.md` (how to build) and `Sovrinty_Website_Outline.md` (what content
goes where) — these two are authoritative. `CLAUDE.md` summarizes conventions.

## Local development

The shared chrome (header / footer / CTA) is injected client-side via
`fetch()` of `partials/*.html`, so the site **must be served over HTTP** —
opening files as `file://` will break the includes.

```bash
python3 -m http.server 8080   # from the repo root
# then open http://localhost:8080
```

There is no `package.json`, no lint, no test, and no build tooling.

## Structure

```
index.html              Home — framing + two doors + the 10 problem doorways
walkthrough.html        The guided journey (scenes S0–S6 + close)
problems/pN-*.html      The ten problem explainers
partials/               header.html · footer.html · cta.html (injected by app.js)
assets/
  css/
    tokens.css          design tokens (imported from the design system; do not edit)
    base.css            element defaults + utilities
    components.css      sv-* site components (token-only)
  design/tokens/        the design system's token files, copied verbatim
  js/app.js             include injector + global init
  media/img/            brand SVGs (seal, golden-spike, wordmarks)
media-manifest.md       registry of every media slot + status
```

## Design system

All color / type / spacing / radius / elevation / motion comes from the
**Sovrinty Design System** on claude.ai/design
(`ca731c46-7fc3-4231-a2ed-30a58023fd34`). Its token files are copied verbatim
into `assets/design/tokens/` and exposed via `assets/css/tokens.css`. `base.css`
and `components.css` reference **only** CSS custom properties — never a literal
hex, font name, or spacing value. Re-sync tokens from the design system rather
than editing them locally.

Brand rule, enforced throughout: **violet acts, gold proves** — violet carries
every action (buttons, nav, links, focus); brass-gold is reserved for proof
(seals, citations, the audit chain, the Golden Spike). The deep-violet
**Moment** ground (`data-theme="moment"`) is used for the hero and the CTA.

## Deployment

GitHub Pages from `main` at repo root. Keep `.nojekyll` so files serve raw.
No build step: every push deploys. **It works from any base path** — a user/org
site (`name.github.io`), a project site (`name.github.io/repo/`), or a custom
domain — with no configuration: each page's `<head>` uses depth-relative CSS/JS
paths, and `app.js` derives the deployment base from its own module URL
(`import.meta.url`) and rewrites the root-relative links + includes at runtime.
Name the repo whatever you like.

> The repo is not yet a git repository — run `git init` and add a GitHub remote
> before the Pages deploy path applies.

## Status

Phase 1 scaffold: every page exists with real structure, shared chrome,
token-only styling, placeholder media, and copy from the Outline (with `TODO:`
markers where finished copy is still to be written). Finalize pages one at a
time per `BUILD_SPEC.md` §8.
