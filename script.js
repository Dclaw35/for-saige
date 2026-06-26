const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

window.addEventListener("load", () => {
  runIntro();
  createPetals();
  createEmbers();
  setupRevealObserver();
  setupCopyButton();
});

function runIntro() {
  const opening = qs(".opening");
  const heart = qs(".heart-loader");
  const hi = qs(".intro-line");

  setTimeout(() => heart.classList.add("hide"), 3000);
  setTimeout(() => hi.classList.add("show"), 4300);
  setTimeout(() => hi.classList.add("hide"), 6900);
  setTimeout(() => {
    opening.classList.add("done");
    document.body.classList.add("intro-complete");
    runHeroSequence();
  }, 8200);
}

const heroLines = [
  "You once thought I was creepy.",
  "I thought you were the prettiest girl I’d ever seen.",
  "Turns out one of us was right.",
  "I made this because sometimes the things that matter most deserve more than a text message.",
  "So...",
  "Welcome to a tiny little corner of the internet that exists for one reason."
];

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runHeroSequence() {
  const box = qs("#hero-sequence");
  await wait(1150);

  for (const text of heroLines) {
    const line = document.createElement("p");
    line.className = "hero-line";
    line.textContent = text;
    box.appendChild(line);
    await wait(90);
    line.classList.add("show");
    await wait(text.length > 70 ? 2450 : 1650);
    line.classList.add("hide");
    await wait(900);
    line.remove();
  }

  document.body.classList.add("hero-complete");
}

function typeText(el, text, speed = 38) {
  let i = 0;
  function tick() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i++);
      setTimeout(tick, speed);
    }
  }
  tick();
}

function setupRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");

      const secondType = entry.target.querySelector("#second-type");
      if (secondType && !secondType.dataset.started) {
        secondType.dataset.started = "true";
        typeText(secondType, secondType.dataset.text || "", 38);
      }

      const loveCopy = entry.target.querySelector(".love-copy");
      if (loveCopy && !loveCopy.dataset.butterfly) {
        loveCopy.dataset.butterfly = "true";
        setTimeout(() => loveCopy.classList.add("butterfly-time"), 900);
      }
    });
  }, { threshold: 0.18 });

  qsa(".reveal").forEach((el) => observer.observe(el));
}

function createPetals() {
  const field = qs(".petal-field");
  if (!field) return;
  for (let i = 0; i < 12; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${26 + Math.random() * 30}s`;
    petal.style.animationDelay = `${-Math.random() * 38}s`;
    petal.style.width = `${9 + Math.random() * 10}px`;
    petal.style.height = `${16 + Math.random() * 15}px`;
    petal.style.setProperty("--drift", `${Math.random() * 150 - 75}px`);
    field.appendChild(petal);
  }
}

function createEmbers() {
  const field = qs(".ember-field");
  if (!field) return;
  for (let i = 0; i < 42; i++) {
    const ember = document.createElement("span");
    ember.className = "ember";
    ember.style.left = `${Math.random() * 100}vw`;
    ember.style.top = `${Math.random() * 100}vh`;
    ember.style.animationDuration = `${4 + Math.random() * 8}s`;
    ember.style.animationDelay = `${-Math.random() * 8}s`;
    field.appendChild(ember);
  }
}

function setupCopyButton() {
  const btn = qs("#copy-letter");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const name = qs("#from").value.trim() || "Saige";
    const letter = qs("#letter").value.trim();
    const status = qs("#copy-status");

    if (!letter) {
      status.textContent = "You have to write the letter first, beautiful. The button is powerful, but not psychic.";
      return;
    }

    try {
      await navigator.clipboard.writeText(`From: ${name}\n\n${letter}`);
      status.textContent = "Copied. Now paste it into a text to me. The romance goblin has completed his task.";
    } catch {
      status.textContent = "Copy did not work automatically. Highlight the text and copy it the old fashioned way. Tragic, but survivable.";
    }
  });
}
