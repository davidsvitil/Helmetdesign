// Bílá helma -> při najetí se od kurzoru "nastříká" skutečný design
const reveal = document.getElementById("heroReveal");
let r = 0, raf = null, shown = false;
const MAX = 160; // % šířky – pokryje celou fotku

function setPoint(e) {
  const b = reveal.getBoundingClientRect();
  reveal.style.setProperty("--x", ((e.clientX - b.left) / b.width) * 100 + "%");
  reveal.style.setProperty("--y", ((e.clientY - b.top) / b.height) * 100 + "%");
}

function animateTo(target, dur) {
  cancelAnimationFrame(raf);
  const from = r, t0 = performance.now();
  const step = (now) => {
    const t = Math.max(0, Math.min(1, (now - t0) / dur));
    const k = 1 - Math.pow(1 - t, 3);
    r = from + (target - from) * k;
    reveal.style.setProperty("--r", r.toFixed(2) + "%");
    if (t < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}

function show(e) { if (e) setPoint(e); shown = true; reveal.classList.add("is-painted"); animateTo(MAX, 1600); }
function hide(e) { if (e) setPoint(e); shown = false; reveal.classList.remove("is-painted"); animateTo(0, 700); }

reveal.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") show(e); });
reveal.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") hide(e); });
reveal.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") (shown ? hide : show)(e); });
reveal.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    reveal.style.setProperty("--x", "50%");
    reveal.style.setProperty("--y", "50%");
    shown ? hide() : show();
  }
});
