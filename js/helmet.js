/* Expose Designs – SVG helma
 * helmetSVG(uid, design) vrátí markup jedné helmy.
 * Čistá bílá skořepina je vždy vespod, design leží nad ní v masce (#uid-mask),
 * takže ho jde „nastříkat“ animací kruhu v masce.
 */

const SHELL =
  "M150 398 C108 335 112 205 228 128 C320 70 470 74 548 150 " +
  "C592 195 602 262 594 322 C589 362 576 392 556 410 " +
  "C541 420 522 423 500 423 L215 426 C186 426 165 416 150 398 Z";

const VISOR =
  "M330 190 C420 165 530 180 578 236 C584 275 578 305 566 325 " +
  "C500 338 410 336 350 318 C325 285 318 230 330 190 Z";

const EYEPORT =
  "M345 202 C420 182 518 192 566 242 C572 272 567 300 557 316 " +
  "C498 327 420 325 362 310 C341 280 335 236 345 202 Z";

/* Organický „topo/maze“ vzor – feTurbulence rozsekaný na pruhy */
function topoFilter(id, freq, seed, dark, light) {
  return `
  <filter id="${id}" x="0" y="0" width="640" height="520" filterUnits="userSpaceOnUse">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}" result="n"/>
    <feColorMatrix in="n" type="matrix"
      values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="g"/>
    <feComponentTransfer in="g" result="b">
      <feFuncR type="discrete" tableValues="0 1 0 1 0 1 0 1 0"/>
      <feFuncG type="discrete" tableValues="0 1 0 1 0 1 0 1 0"/>
      <feFuncB type="discrete" tableValues="0 1 0 1 0 1 0 1 0"/>
    </feComponentTransfer>
    <feComponentTransfer in="b">
      <feFuncR type="table" tableValues="${dark[0]} ${light[0]}"/>
      <feFuncG type="table" tableValues="${dark[1]} ${light[1]}"/>
      <feFuncB type="table" tableValues="${dark[2]} ${light[2]}"/>
    </feComponentTransfer>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>`;
}

/* Jemné tečkování (granit/sprej) */
function speckleFilter(id, seed, color) {
  return `
  <filter id="${id}" x="0" y="0" width="640" height="520" filterUnits="userSpaceOnUse">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="${seed}" result="n"/>
    <feColorMatrix in="n" type="matrix"
      values="0 0 0 0 ${color[0]}  0 0 0 0 ${color[1]}  0 0 0 0 ${color[2]}  9 0 0 0 -5.2"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>`;
}

const DESIGNS = {
  /* Inspirace: 3XL racing livery – červená, bílá, petrolejově zelená */
  "3xl": (u) => `
    <rect width="640" height="520" fill="#33b99d"/>
    <path d="M90 175 C200 120 330 100 640 140 L640 175 C400 140 220 160 90 215 Z" fill="#0e6b63"/>
    <path d="M90 215 C220 160 400 140 640 175 L640 192 C400 160 220 185 90 245 Z" fill="#141617"/>
    <path d="M90 245 C200 195 300 180 345 185 L340 236 C300 232 200 250 90 296 Z" fill="url(#${u}-topoPat)"/>
    <path d="M90 296 C200 250 300 236 340 238 L345 252 C300 252 200 268 90 318 Z" fill="#141617"/>
    <path d="M90 318 C200 268 300 252 345 252 L362 312 C430 330 520 332 600 320 L600 450 L90 450 Z" fill="#e32b2b"/>
    <path d="M150 390 L250 300 L290 300 L190 390 Z" fill="#141617"/>
    <path d="M215 425 L330 322 L352 322 L240 425 Z" fill="#141617"/>
    <path d="M300 425 L380 340 L470 345 L430 360 L345 425 Z" fill="#141617"/>
    <path d="M115 320 C150 300 175 300 205 296 L130 370 Z" fill="#a51818"/>
    <path d="M520 330 L610 318 L610 450 L470 450 Z" fill="url(#${u}-topoPat)"/>
    <path d="M505 333 L520 330 L470 450 L455 450 Z" fill="#141617"/>
    <text x="395" y="402" font-family="Inter, Arial, sans-serif" font-weight="900" font-style="italic"
      font-size="44" fill="#fff" stroke="#141617" stroke-width="3" paint-order="stroke">95</text>
    <text x="205" y="262" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="14"
      letter-spacing="3" fill="#141617" transform="rotate(-12 205 262)">EXPOSE</text>`,

  /* Inspirace: 3AE adventure – navy, červená, bílé vlny, granitový štít */
  "3ae": (u) => `
    <rect width="640" height="520" fill="#1f2c63"/>
    <g filter="url(#${u}-speckle)"><rect width="640" height="520"/></g>
    <path d="M90 140 C200 90 330 80 460 105 C420 120 300 120 230 140 C170 158 120 180 90 200 Z" fill="#c9a3b4" opacity=".9"/>
    <g filter="url(#${u}-speckle2)"><path d="M90 140 C200 90 330 80 460 105 C420 120 300 120 230 140 C170 158 120 180 90 200 Z"/></g>
    <path d="M90 330 C170 300 230 330 300 320 C360 312 400 280 470 300 C520 314 560 330 600 325 L600 450 L90 450 Z" fill="#fff"/>
    <path d="M90 352 C170 322 230 352 300 342 C360 334 400 302 470 322 C520 336 560 352 600 347 L600 450 L90 450 Z" fill="#e0262e"/>
    <path d="M90 410 C160 380 230 420 320 405 C380 395 430 380 500 395 L500 450 L90 450 Z" fill="#1f2c63"/>
    <path d="M140 400 C170 370 200 372 225 392 C205 404 180 410 140 400 Z" fill="#fff"/>
    <path d="M520 250 C560 260 590 300 600 330 L600 360 C570 340 540 300 520 250 Z" fill="#e0262e"/>
    <text x="175" y="262" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="15"
      letter-spacing="1.5" fill="#fff" transform="rotate(-12 175 262)">ONE LIFE — LIVE IT!</text>`,

  /* Inspirace: Eliška – baby blue s ornamenty, bílý pás s kresbičkami, limetková, číslo 12 */
  "eliska": (u) => `
    <rect width="640" height="520" fill="#9fd3ec"/>
    <g filter="url(#${u}-swirl)" opacity=".55"><rect width="640" height="520" fill="#fff"/></g>
    <path d="M330 190 C300 230 300 290 335 340 L250 450 L620 450 L620 140 C540 150 420 160 330 190 Z" fill="#f7f8f8"/>
    <path d="M330 186 C420 158 530 150 620 135 L620 146 C530 160 420 168 333 196 Z" fill="#17191a"/>
    <path d="M335 340 L420 340 L330 450 L250 450 Z" fill="#7ed957"/>
    <path d="M335 340 L345 340 L262 450 L250 450 Z" fill="#17191a"/>
    <circle cx="352" cy="390" r="13" fill="#17191a"/>
    <text x="352" y="395" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="13" fill="#fff">X</text>
    <g font-family="Arial, sans-serif" fill="#17191a">
      <text x="430" y="365" font-size="22">♪</text>
      <text x="470" y="395" font-size="18">♫</text>
      <text x="415" y="408" font-size="20">✿</text>
      <text x="505" y="360" font-size="16">★</text>
      <text x="455" y="352" font-size="15">♪</text>
    </g>
    <text x="512" y="410" font-family="Inter, Arial, sans-serif" font-weight="900" font-size="46"
      fill="#7ed957" transform="rotate(-6 512 410)">12</text>`,
};

function helmetSVG(uid, design = "3xl") {
  return `
<svg class="helmet-svg" viewBox="40 40 600 440" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="Motocyklová helma">
  <defs>
    <clipPath id="${uid}-clip"><path d="${SHELL}"/></clipPath>
    <radialGradient id="${uid}-white" cx="38%" cy="28%" r="80%">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset=".55" stop-color="#eef1f3"/>
      <stop offset="1" stop-color="#b9c0c5"/>
    </radialGradient>
    <linearGradient id="${uid}-shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset=".45" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".32"/>
    </linearGradient>
    <linearGradient id="${uid}-gloss" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".85"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="${uid}-visor" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3a4247"/>
      <stop offset=".6" stop-color="#15191b"/>
      <stop offset="1" stop-color="#0b0d0e"/>
    </linearGradient>
    <linearGradient id="${uid}-iridium" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7ef0ff"/>
      <stop offset=".35" stop-color="#2a8bff"/>
      <stop offset=".7" stop-color="#3b2bd6"/>
      <stop offset="1" stop-color="#0c1a5a"/>
    </linearGradient>
    <filter id="${uid}-soft" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="22"/>
    </filter>
    ${topoFilter(`${uid}-topo`, 0.03, 7, [0.08, 0.09, 0.09], [1, 1, 1])}
    ${topoFilter(`${uid}-swirl`, 0.02, 3, [0.62, 0.83, 0.93], [1, 1, 1])}
    ${speckleFilter(`${uid}-speckle`, 4, [0.6, 0.65, 0.85])}
    ${speckleFilter(`${uid}-speckle2`, 9, [0.35, 0.2, 0.3])}
    <pattern id="${uid}-topoPat" patternUnits="userSpaceOnUse" width="640" height="520">
      <rect width="640" height="520" fill="#fff" filter="url(#${uid}-topo)"/>
    </pattern>
    <mask id="${uid}-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="520">
      <rect width="640" height="520" fill="#000"/>
      <circle class="reveal" cx="330" cy="260" r="0" fill="#fff" filter="url(#${uid}-soft)"/>
    </mask>
  </defs>

  <!-- stín pod helmou -->
  <ellipse cx="350" cy="440" rx="250" ry="18" fill="#000" opacity=".45" filter="url(#${uid}-soft)"/>

  <!-- spoiler -->
  <path d="M150 228 C140 200 160 168 200 148 L262 124 C240 160 200 200 150 228 Z" fill="#202426"/>

  <!-- čistá bílá skořepina -->
  <path d="${SHELL}" fill="url(#${uid}-white)"/>

  <!-- design (maskovaný) -->
  <g clip-path="url(#${uid}-clip)">
    <g class="design-layer" mask="url(#${uid}-mask)" data-design="${design}">${DESIGNS[design](uid)}</g>
  </g>

  <!-- lak: stínování + lesk -->
  <path d="${SHELL}" fill="url(#${uid}-shade)" pointer-events="none"/>
  <g clip-path="url(#${uid}-clip)" pointer-events="none">
    <path d="M165 250 C180 165 260 105 360 95 C300 120 240 160 200 240 Z" fill="url(#${uid}-gloss)" opacity=".9"/>
    <ellipse cx="440" cy="112" rx="60" ry="11" fill="#fff" opacity=".35" transform="rotate(12 440 112)"/>
  </g>

  <!-- průzor + plexi -->
  <path d="${EYEPORT}" fill="#0b0d0e"/>
  <path d="${VISOR}" fill="url(#${uid}-visor)" opacity=".92"/>
  <path class="iridium" d="${VISOR}" fill="url(#${uid}-iridium)" mask="url(#${uid}-mask)"/>
  <path d="M345 205 C420 182 500 186 550 215 C480 200 410 204 352 228 Z" fill="#fff" opacity=".22"/>
  <circle cx="342" cy="258" r="15" fill="#1d2123"/>
  <circle cx="342" cy="258" r="6" fill="#3b4246"/>

  <!-- gumová lišta + větrání -->
  <path d="M146 392 C160 418 182 429 212 429 L502 426 C530 425 548 418 560 404 L551 396
           C540 408 524 412 500 412 L214 414 C190 414 172 407 160 388 Z" fill="#1b1e20"/>
  <g fill="#1b1e20">
    <rect x="548" y="345" width="22" height="5" rx="2.5" transform="rotate(-20 559 347)"/>
    <rect x="545" y="358" width="22" height="5" rx="2.5" transform="rotate(-20 556 360)"/>
    <rect x="330" y="88" width="34" height="8" rx="4" transform="rotate(-2 347 92)"/>
  </g>
</svg>`;
}

/* Animace odhalení: kruh v masce roste/smršťuje se od bodu kurzoru */
function attachReveal(container, { trigger = container } = {}) {
  const svg = container.querySelector("svg");
  const circle = svg.querySelector(".reveal");
  let r = 0, raf = null, shown = false;

  const toSvg = (e) => {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };

  const animateTo = (target, dur) => {
    cancelAnimationFrame(raf);
    const from = r, t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = Math.max(0, Math.min(1, (now - t0) / dur));
      r = from + (target - from) * ease(t);
      circle.setAttribute("r", r.toFixed(1));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };

  const show = (e) => {
    if (e && e.clientX !== undefined) {
      const p = toSvg(e);
      circle.setAttribute("cx", p.x); circle.setAttribute("cy", p.y);
    }
    shown = true; container.classList.add("is-painted");
    animateTo(720, 900);
  };
  const hide = (e) => {
    if (e && e.clientX !== undefined) {
      const p = toSvg(e);
      circle.setAttribute("cx", p.x); circle.setAttribute("cy", p.y);
    }
    shown = false; container.classList.remove("is-painted");
    animateTo(0, 600);
  };

  trigger.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") show(e); });
  trigger.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") hide(e); });
  trigger.addEventListener("pointerup", (e) => {
    if (e.pointerType !== "mouse") (shown ? hide : show)(e);
  });

  return {
    show, hide,
    get shown() { return shown; },
    setDesign(name, uid) {
      const layer = svg.querySelector(".design-layer");
      layer.innerHTML = DESIGNS[name](uid);
      layer.dataset.design = name;
    },
  };
}
