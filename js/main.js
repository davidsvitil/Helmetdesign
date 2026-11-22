// Helma je bílá. Klik = nastříkat design, další klik = zpět na bílou.
// Při každém dalším nastříkání se vezme další design v pořadí.
const DESIGNS = [
  { src: "img/helmet-3xl.webp", name: "3XL racing livery" },
  { src: "img/helmet-onelife.webp", name: "One Life – navy & red" },
  { src: "img/helmet-sky.webp", name: "Sky #12 – baby blue" },
];

const reveal = document.getElementById("heroReveal");
const topImg = reveal.querySelector(".reveal-top");
const nameEl = document.getElementById("designName");
const countEl = document.getElementById("designCount");
const MAX = 160; // % – pokryje celou fotku

let r = 0, raf = null, painted = false, next = 0;

// přednačíst všechny designy, ať se nečeká při kliknutí
DESIGNS.forEach((d) => { const i = new Image(); i.src = d.src; });

function setPoint(e) {
  const b = reveal.getBoundingClientRect();
  const x = e ? ((e.clientX - b.left) / b.width) * 100 : 50;
  const y = e ? ((e.clientY - b.top) / b.height) * 100 : 50;
  reveal.style.setProperty("--x", x + "%");
  reveal.style.setProperty("--y", y + "%");
}

function animateTo(target, dur) {
  cancelAnimationFrame(raf);
  const from = r, t0 = performance.now();
  const step = (now) => {
    const t = Math.max(0, Math.min(1, (now - t0) / dur));
    const k = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic
    r = from + (target - from) * k;
    reveal.style.setProperty("--r", r.toFixed(2) + "%");
    if (t < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}

function paint(e) {
  const d = DESIGNS[next];
  topImg.src = d.src;
  nameEl.textContent = d.name;
  countEl.textContent = `${next + 1} / ${DESIGNS.length}`;
  next = (next + 1) % DESIGNS.length;
  setPoint(e);
  painted = true;
  reveal.classList.add("is-painted");
  reveal.setAttribute("aria-pressed", "true");
  animateTo(MAX, 1400);
}

function clear(e) {
  setPoint(e);
  painted = false;
  reveal.classList.remove("is-painted");
  reveal.setAttribute("aria-pressed", "false");
  animateTo(0, 800);
}

const toggle = (e) => (painted ? clear(e) : paint(e));

reveal.addEventListener("click", (e) => toggle(e));
reveal.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(null); }
});
