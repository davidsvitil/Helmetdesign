// Portfolio (galerie + filtry + lightbox), projekty a poptávkový formulář
(() => {
  // Výchozí popisky (Expose); jiné weby je přepíšou přes window.SITE_ALT
  const ALT = Object.assign(
    { helmy: "Ručně malovaná helma", motorky: "Lakovaná motorka a výbava", dilna: "Z dílny Expose Designs" },
    window.SITE_ALT || {}
  );
  const altOf = (it) => it.title || ALT[it.cat] || "Ukázka práce";
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Galerie ---------- */
  const gallery = document.getElementById("gallery");
  const moreBtn = document.getElementById("galleryMore");
  const STEP = window.matchMedia("(max-width: 600px)").matches ? 8 : 16;
  let current = PORTFOLIO; // celá filtrovaná sada (pro lightbox)
  let shown = STEP, filter = "all";

  function renderGallery() {
    const list = filter === "all" ? PORTFOLIO : PORTFOLIO.filter((i) => i.cat === filter);
    current = list;
    const visible = list.slice(0, shown);
    moreBtn.hidden = shown >= list.length;
    moreBtn.textContent = `Zobrazit další (${list.length - visible.length})`;
    gallery.innerHTML = visible.map((it, idx) => `
      <button class="g-item" data-idx="${idx}" style="aspect-ratio:${it.w}/${it.h}">
        <img src="${it.src}" width="${it.w}" height="${it.h}" alt="${esc(altOf(it))}" loading="lazy">
      </button>`).join("");
  }
  renderGallery();
  moreBtn.addEventListener("click", () => { shown += STEP; renderGallery(); });

  document.querySelectorAll(".filters .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filters .chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      filter = chip.dataset.filter; shown = STEP;
      renderGallery();
    });
  });

  gallery.addEventListener("click", (e) => {
    const b = e.target.closest(".g-item");
    if (b) openLightbox(current, +b.dataset.idx);
  });

  /* ---------- Projekty ---------- */
  // data-project = sada fotek projektu, data-open = otevřít celé portfolio na dané fotce
  document.querySelectorAll(".card[data-project], .card[data-open]").forEach((card) => {
    const proj = card.dataset.project;
    const set = proj ? PORTFOLIO.filter((i) => i.project === proj) : PORTFOLIO;
    const start = proj ? 0 : Math.max(0, set.findIndex((i) => i.src === card.dataset.open));
    const cnt = card.querySelector(".card-count");
    if (cnt) cnt.textContent = proj ? `${set.length} fotek` : `${set.length} prací v galerii`;
    card.addEventListener("click", () => openLightbox(set, start));
  });

  /* ---------- Lightbox ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCount = document.getElementById("lbCount");
  let lbSet = [], lbIdx = 0;

  function show(i) {
    lbIdx = (i + lbSet.length) % lbSet.length;
    const it = lbSet[lbIdx];
    lbImg.src = it.src;
    lbImg.alt = altOf(it);
    lbCount.textContent = (it.title ? it.title + "  ·  " : "") + `${lbIdx + 1} / ${lbSet.length}`;
    // přednačíst sousední
    [1, -1].forEach((d) => { const n = lbSet[(lbIdx + d + lbSet.length) % lbSet.length]; new Image().src = n.src; });
  }
  function openLightbox(set, i) {
    lbSet = set; show(i);
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
    document.body.classList.add("no-scroll");
  }
  function closeLightbox() {
    if (typeof lb.close === "function") lb.close(); else lb.removeAttribute("open");
  }
  lb.addEventListener("close", () => document.body.classList.remove("no-scroll"));
  lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lb.querySelector(".lb-prev").addEventListener("click", () => show(lbIdx - 1));
  lb.querySelector(".lb-next").addEventListener("click", () => show(lbIdx + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); }); // klik mimo fotku
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(lbIdx + 1);
    if (e.key === "ArrowLeft") show(lbIdx - 1);
  });
  // swipe na mobilu
  let sx = null;
  lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(lbIdx + (dx < 0 ? 1 : -1));
    sx = null;
  });

  /* ---------- Poptávka -> e-mail firmy ---------- */
  const form = document.getElementById("inquiryForm");
  const EMAIL = form.dataset.email || "info@expose.cz";
  const done = document.getElementById("formDone");
  let lastBody = "", lastHref = "";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      form.querySelector(":invalid").focus();
      return;
    }
    const f = new FormData(form);
    // řádek se vypíše jen pokud pole na daném webu existuje
    const line = (label, name, multi) => {
      if (!form.elements[name]) return "";
      const v = multi ? f.getAll(name).join(", ") : f.get(name);
      return `${label}: ${v || "neuvedeno"}\n`;
    };
    lastBody =
`Dobrý den,

posílám poptávku přes web.

` + line("Jméno", "jmeno") + line("E-mail", "email") + line("Telefon", "telefon") +
      line("Co nabarvit", "typ") + line("Model / předmět", "model") + line("Styl", "styl", true) +
      line("Termín", "termin") + line("Helma", "helma") + line("Místo", "misto") +
`
Nápad:
${f.get("zprava")}

Děkuji,
${f.get("jmeno")}`;
    const subject = `Poptávka: ${f.get("typ")} – ${f.get("jmeno")}`;
    lastHref = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lastBody)}`;
    document.getElementById("mailAgain").href = lastHref;
    window.location.href = lastHref;
    done.hidden = false;
    done.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  document.getElementById("copyInquiry").addEventListener("click", async (e) => {
    try {
      await navigator.clipboard.writeText(lastBody);
      e.target.textContent = "Zkopírováno ✓";
    } catch {
      e.target.textContent = "Kopírování nejde – označ text ručně";
    }
  });
})();
