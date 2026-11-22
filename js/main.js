// Helma je bílá. Klik = nastříkat design od místa kliknutí, další klik = zpět na bílou.
const reveal = document.getElementById("heroReveal");
const topImg = reveal.querySelector(".reveal-top");

const EDGE = 12;          // šířka měkkého okraje "spreje" v %
const FULL = 100 + EDGE;  // 100 % = nejvzdálenější roh -> při FULL je pokryto celé
let r = 0, raf = null, painted = false;
let px = 50, py = 50;

function applyMask() {
  const solid = Math.max(0, r - EDGE);
  const m = r <= 0
    ? "linear-gradient(transparent, transparent)"
    : `radial-gradient(circle farthest-corner at ${px}% ${py}%, #000 ${solid}%, transparent ${r}%)`;
  topImg.style.webkitMaskImage = m;
  topImg.style.maskImage = m;
}

function setPoint(e) {
  if (!e || e.clientX === undefined || (e.clientX === 0 && e.clientY === 0 && e.detail === 0)) {
    px = 50; py = 50; return; // klávesnice
  }
  const b = reveal.getBoundingClientRect();
  px = Math.min(100, Math.max(0, ((e.clientX - b.left) / b.width) * 100));
  py = Math.min(100, Math.max(0, ((e.clientY - b.top) / b.height) * 100));
}

function animateTo(target, dur) {
  cancelAnimationFrame(raf);
  const from = r, t0 = performance.now();
  // délka úměrná zbývající vzdálenosti -> přerušení v půlce nepůsobí líně
  const d = dur * Math.abs(target - from) / FULL;
  const step = (now) => {
    const t = d <= 0 ? 1 : Math.max(0, Math.min(1, (now - t0) / d));
    const k = 1 - Math.pow(1 - t, 3); // easeOutCubic – reakce je vidět hned
    r = from + (target - from) * k;
    applyMask();
    if (t < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}

function toggle(e) {
  setPoint(e);
  painted = !painted;
  reveal.classList.toggle("is-painted", painted);
  reveal.setAttribute("aria-pressed", String(painted));
  animateTo(painted ? FULL : 0, painted ? 1300 : 900);
}

applyMask();
reveal.addEventListener("click", toggle);
reveal.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(null); }
});
