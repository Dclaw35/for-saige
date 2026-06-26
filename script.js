const qs = (sel, root = document) => root.querySelector(sel);

window.addEventListener("load", () => {
  createPetals();
  createEmbers();
  setupCopyButton();
});

function createPetals() {
  const field = qs(".petal-field");
  if (!field) return;
  for (let i = 0; i < 10; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${28 + Math.random() * 32}s`;
    petal.style.animationDelay = `${-Math.random() * 38}s`;
    petal.style.width = `${9 + Math.random() * 10}px`;
    petal.style.height = `${16 + Math.random() * 15}px`;
    petal.style.setProperty("--drift", `${Math.random() * 140 - 70}px`);
    field.appendChild(petal);
  }
}

function createEmbers() {
  const field = qs(".ember-field");
  if (!field) return;
  for (let i = 0; i < 38; i++) {
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
