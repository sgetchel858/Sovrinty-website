# Media manifest

Registry of every media slot on the site and its status. Each slot in the
HTML carries a stable `data-media` (video/image) or `data-anim` id and reserves
its final `aspect-ratio` via `style="--aspect:…"`, so real media can be dropped
in later without layout churn.

**Swap-in contract:** replace the inner `.sv-media__placeholder` with the real
`<video>` / animation root / `<img>`, but keep the `<figure class="sv-media …">`
wrapper, the id, and `--aspect`. Then update the status row below.

Video, when built: `muted playsinline preload="metadata"`, a `poster`,
lazy-loaded, with a captions `<track>` slot. Animations must honor
`@media (prefers-reduced-motion: reduce)` with a static fallback.

## Walkthrough (`walkthrough.html`)

| id | type | scene | aspect | target length | status | notes |
|---|---|---|---|---|---|---|
| s0-framing        | anim  | S0 | 16/9 | —    | **live** (CSS/JS) | the unproven answer — a chat window: user (right/violet) asks, generic "Assistant" (left/grey) answers confidently from nowhere with typing dots, user pushes back, it folds to "I don't know" + a hollow amber "unverified" seal. `pages/walkthrough.css` + `js/modules/walkthrough-scenes.js` |
| s1-single-source  | anim  | S1 | 16/9 | —    | **live** (CSS/JS) | scattered sources → a forming gold chain → one sealed "Governed source of truth" |
| s2-tbd            | reserved | S2 | 16/9 | —    | placeholder | Scene 2 reserved — "Mission Control" cut (it depicted a standalone dashboard the product lacks). Replacement content TBD. The retired clip stays in the repo but is unused by the page: `assets/media/{video,poster,captions}/s2-mission-control.*` |
| s3-sme-desk       | video | S3 | 16/9 | ~20s | approved | SME inbox, complete in Microsoft Teams; own screen → 100%. Remotion build in `Videos/Scenes/s3-sme-desk` → `assets/media/{video,poster,captions}/s3-sme-desk.*` |
| s4-proof          | anim  | S4 | 16/9 | —    | **live** (CSS/JS) | answer → citation thread → green "Verified" seal stamps → audit hash + Golden Spike |
| s5-stays-current  | video | S5 | 16/9 | ~20s | placeholder | published → approve → health 100% |
| s6-ask-anything   | video | S6 | 16/9 | ~20s | placeholder | ask a question, cited answer, gated |

## Problem doorways (`problems/pN-*.html`)

| id | type | page | aspect | status | notes |
|---|---|---|---|---|---|
| p0-media | anim  | p0-trust              | 16/9 | placeholder | hover claim → source; golden-spike seal lands |
| p1-media | image | p1-locked-in-expertise| 16/9 | placeholder | expert report opens; answer rises into a cited card |
| p2-media | anim  | p2-staleness          | 16/9 | **live** (in-page CSS/JS) | staleness ripple — interactive: "Change the source" flips answers Approved→Stale, "Re-certify" resolves. `pages/p2-staleness.css` + `js/modules/staleness-ripple.js`. Auto-plays once on view; reduced-motion safe. |
| p3-media | image | p3-find-the-sme       | 16/9 | placeholder | a review routed to the right expert |
| p4-media | image | p4-chasing-the-sme    | 16/9 | placeholder | approval tapped inside a Teams/Slack card |
| p5-media | image | p5-access-control     | 16/9 | placeholder | answer gated at a clearance checkpoint |
| p6-media | image | p6-sovereignty        | 16/9 | placeholder | answer contained within a sealed boundary |
| p7-media | anim  | p7-conflicts          | 16/9 | placeholder | generic blend vs. Sovrinty's surfaced conflict |
| p8-media | image | p8-verbatim           | 16/9 | placeholder | regulated passage clamped, word-for-word |
| p9-media | anim  | p9-coverage           | 16/9 | placeholder | coverage map / gap outlined |

## Brand assets (`assets/media/img/`)

| file | status | notes |
|---|---|---|
| seal.svg                  | final | product mark / favicon. From the Sovrinty Design System. |
| golden-spike.svg          | final | immutable-record / verified motif only. |
| logo-wordmark.svg         | final | "Sovrinty" wordmark (light grounds). |
| logo-wordmark-inverse.svg | final | "Sovrinty" wordmark (dark / Moment grounds). |

> Fonts (Spectral, IBM Plex Sans/Mono) are placeholder webfonts from Google
> Fonts, inherited from the design system — swap for licensed `@font-face` +
> bundled `.woff2` when final fonts are chosen (`assets/design/tokens/fonts.css`).
