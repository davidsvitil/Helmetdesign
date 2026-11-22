// Hero helma: bílá, design se odhalí při najetí
const hero = document.getElementById("heroHelmet");
hero.innerHTML = helmetSVG("hero", "3xl");
const heroReveal = attachReveal(hero);

document.querySelectorAll(".design-picker .chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".design-picker .chip").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    heroReveal.setDesign(chip.dataset.design, "hero");
    // ukázat nový design hned po výběru
    const rect = hero.getBoundingClientRect();
    heroReveal.show({ clientX: rect.left + rect.width * 0.5, clientY: rect.top + rect.height * 0.5 });
  });
});

hero.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    const rect = hero.getBoundingClientRect();
    const p = { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 };
    heroReveal.shown ? heroReveal.hide(p) : heroReveal.show(p);
  }
});

// Portfolio: taky bílé, design při najetí na kartu
document.querySelectorAll(".card").forEach((card, i) => {
  const box = card.querySelector(".card-helmet");
  box.innerHTML = helmetSVG(`card${i}`, card.dataset.design);
  attachReveal(box, { trigger: card });
});
