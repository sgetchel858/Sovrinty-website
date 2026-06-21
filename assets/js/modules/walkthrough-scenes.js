/* ============================================================
   Walkthrough scene animations — scroll trigger.
   Adds .is-in to each [data-scene-anim] root when it enters view,
   which fires the token-only CSS animations in pages/walkthrough.css.
   Under prefers-reduced-motion, .is-in is added immediately and the
   global base.css rule neutralizes the motion — so the end state
   shows with no animation. Self-initializing ES module.
   ============================================================ */

const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function init() {
  const scenes = Array.from(document.querySelectorAll("[data-scene-anim]"));
  if (!scenes.length) return;

  if (REDUCE || !("IntersectionObserver" in window)) {
    scenes.forEach((el) => el.classList.add("is-in"));
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
    { threshold: 0.4 }
  );
  scenes.forEach((el) => io.observe(el));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
