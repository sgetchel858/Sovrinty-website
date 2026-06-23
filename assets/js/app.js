/* ============================================================
   SOVRINTY — app.js
   Global entry. On load it:
   (1) resolves [data-include] elements by fetching shared partials
       (header / footer / cta) and injecting them;
   (2) rewrites root-relative ("/…") links + asset paths to the
       deployment base, so the site works whether it is served from
       a domain root, a user/org Pages site, OR a project subpath
       (user.github.io/repo/) — with no build step;
   (3) runs global init (active nav, footer year, reveal-on-scroll).

   Page *body* content lives in each HTML file (crawlable); only the
   chrome is injected. The per-page <head> CSS/JS/favicon use
   depth-relative paths (they must load before this script runs).

   NOTE: includes use fetch(), so the site MUST be served over HTTP —
   never opened as file://. Locally:
     python3 -m http.server 8080   (from repo root)
   ============================================================ */

// Deployment base, derived from THIS module's own URL. app.js always lives at
// <base>/assets/js/app.js, so resolving "../../" against it yields the site
// root: "https://host/" at a domain root, "https://host/repo/" at a project
// subpath. No hardcoded base, no build step.
const BASE = new URL("../../", import.meta.url);
const BASE_PATH = BASE.pathname; // "/" or "/repo/"

/** Resolve a root-relative ("/x") path against BASE; leave anything else
 *  (relative paths, #fragments, mailto:, absolute/protocol-relative URLs)
 *  untouched. */
function abs(path) {
  if (typeof path === "string" && path[0] === "/" && path[1] !== "/") {
    return new URL(path.slice(1), BASE).href;
  }
  return path;
}

/** Reduce an absolute same-origin pathname to a base-independent path
 *  ("/walkthrough.html") for comparison, regardless of deployment depth. */
function stripBase(pathname) {
  const p = pathname.startsWith(BASE_PATH)
    ? "/" + pathname.slice(BASE_PATH.length)
    : pathname;
  return p.replace(/index\.html$/, "") || "/";
}

/** Replace every <… data-include="/partials/x.html"> with the fetched
 *  partial markup. Runs in parallel; resolves when all are done. */
async function resolveIncludes() {
  const nodes = Array.from(document.querySelectorAll("[data-include]"));
  await Promise.all(
    nodes.map(async (node) => {
      const url = abs(node.getAttribute("data-include"));
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        node.outerHTML = await res.text();
      } catch (err) {
        // Fail loud, not silent: show a visible, recoverable note rather than
        // leaving the page without its chrome.
        console.error(`[sv] include failed: ${url}`, err);
        node.setAttribute("data-include-error", String(err));
        node.innerHTML =
          `<p class="sv-include-error" role="alert">Couldn’t load <code>${url}</code> ` +
          `&mdash; the site must be served over HTTP, not opened as a file. ` +
          `<a href="/">Go to the home page</a>.</p>`;
      }
    })
  );
}

/** Rewrite root-relative href/src to the deployment base, across the whole
 *  document (page body + injected partials). Run AFTER includes so partial
 *  links are covered too. Skips protocol-relative ("//…") URLs. */
function rewriteLinks(root) {
  const sel =
    'a[href^="/"], area[href^="/"], img[src^="/"], source[src^="/"], track[src^="/"], video[poster^="/"], link[href^="/"]';
  const mediaToReload = new Set();
  root.querySelectorAll(sel).forEach((el) => {
    const attr = el.hasAttribute("href")
      ? "href"
      : el.hasAttribute("poster")
      ? "poster"
      : "src";
    const val = el.getAttribute(attr);
    if (!val || val[0] !== "/" || val[1] === "/") return;
    el.setAttribute(attr, abs(val));
    // A <video>'s <source>/<track>/poster are fetched at PARSE time, before this
    // rewrite runs. Changing the attribute afterward does NOT make the browser
    // retry an already-failed source — that needs an explicit load(). Authored
    // media paths should therefore be depth-relative so they resolve correctly
    // at parse time (see walkthrough.html); this reload is only a safety net for
    // any root-relative media that slips through.
    const video = el.tagName === "VIDEO" ? el : el.closest("video");
    if (video) mediaToReload.add(video);
  });
  mediaToReload.forEach((v) => v.load());
}

/** Mark the nav link matching the current page. A link may declare
 *  data-active-prefix to match a whole section (e.g. /problems/). */
function markActiveNav() {
  const here = stripBase(location.pathname);
  document.querySelectorAll(".sv-nav__link").forEach((a) => {
    const prefix = a.getAttribute("data-active-prefix");
    const linkPath = stripBase(a.pathname);
    const isMatch = prefix ? here.startsWith(prefix) : here === linkPath;
    if (isMatch) a.setAttribute("aria-current", "page");
  });
}

/** Stamp the current year wherever requested. */
function setYear() {
  const y = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = y));
}

/** Reveal-on-scroll. Honors prefers-reduced-motion (reveal immediately). */
function initReveal() {
  const els = document.querySelectorAll(".sv-reveal");
  if (!els.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );
  els.forEach((el) => io.observe(el));
}

async function init() {
  await resolveIncludes();
  rewriteLinks(document);
  markActiveNav();
  setYear();
  initReveal();
  document.dispatchEvent(new CustomEvent("sv:ready"));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
