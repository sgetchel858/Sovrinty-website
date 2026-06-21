/* ============================================================
   P2 — staleness ripple (interactive hero animation)
   A source document links to N answer records, all "Approved".
   "Change the source" ripples Approved → Stale down the records
   (the auto-flag); "Re-certify" resolves them back to Approved
   (the seal). Auto-plays the change once on first scroll into
   view. Honors prefers-reduced-motion (no auto-play, no stagger).

   Self-initializing ES module; operates on static page DOM, so it
   does not depend on the partial includes in app.js.
   ============================================================ */

const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const STAGGER = REDUCE ? 0 : 280; // ms between record flips
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function setBadge(record, state, label) {
  const badge = record.querySelector(".sv-lifecycle");
  if (!badge) return;
  badge.className = "sv-lifecycle sv-lifecycle--" + state;
  badge.innerHTML = '<span class="sv-lifecycle__dot"></span>' + label;
}

function wire(root) {
  const records = Array.from(root.querySelectorAll("[data-record]"));
  const changeBtn = root.querySelector("[data-ripple-change]");
  const recertBtn = root.querySelector("[data-ripple-recert]");
  const caption = root.querySelector("[data-ripple-caption]");
  if (!records.length || !changeBtn || !recertBtn || !caption) return;

  let busy = false;
  let played = false;

  // Reveal the controls only once JS has wired them — no dead button if JS is off.
  const controls = root.querySelector(".sv-ripple__controls");
  if (controls) controls.hidden = false;

  function reset() {
    root.classList.remove("is-changed", "is-rippling");
    records.forEach((r) => {
      r.classList.remove("is-stale", "is-recert");
      setBadge(r, "approved", "Approved");
    });
    caption.textContent = records.length + " answers cite this source · all current";
    changeBtn.disabled = false;
    recertBtn.hidden = true;
    recertBtn.disabled = false;
  }

  async function change() {
    if (busy) return;
    busy = true;
    changeBtn.disabled = true;
    root.classList.add("is-changed", "is-rippling");
    if (!REDUCE) caption.textContent = "Source changed — flagging the answers that cite it…";
    for (let i = 0; i < records.length; i++) {
      await wait(STAGGER);
      records[i].classList.add("is-stale");
      setBadge(records[i], "stale", "Stale");
    }
    await wait(STAGGER);
    root.classList.remove("is-rippling");
    caption.textContent = records.length + " answers are now stale — routed for re-certification.";
    recertBtn.disabled = false;
    recertBtn.hidden = false;
    busy = false;
  }

  async function recert() {
    if (busy) return;
    busy = true;
    recertBtn.disabled = true;
    if (!REDUCE) caption.textContent = "Re-certifying…";
    for (let i = 0; i < records.length; i++) {
      await wait(STAGGER);
      records[i].classList.remove("is-stale");
      records[i].classList.add("is-recert");
      setBadge(records[i], "approved", "Approved");
    }
    await wait(STAGGER);
    records.forEach((r) => r.classList.remove("is-recert"));
    root.classList.remove("is-changed");
    caption.textContent = "Re-certified — every answer current and sealed to the record.";
    recertBtn.hidden = true;
    recertBtn.disabled = false;
    changeBtn.disabled = false;
    busy = false;
  }

  changeBtn.addEventListener("click", change);
  recertBtn.addEventListener("click", recert);
  reset();

  // Auto-play the "change" once when it scrolls into view (skip if reduced motion).
  if (!REDUCE && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !played) {
            played = true;
            io.disconnect();
            change();
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(root);
  }
}

function init() {
  document.querySelectorAll("[data-ripple]").forEach(wire);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
