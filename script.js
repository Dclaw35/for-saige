const slides = Array.from(document.querySelectorAll(".slide"));
const total = slides.length;
let index = 0;
let timer = null;
let userInteracted = false;

const current = document.getElementById("current");
const progressBar = document.getElementById("progress-bar");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const hint = document.getElementById("hint");

function showSlide(nextIndex, manual = false) {
  if (manual) userInteracted = true;
  clearTimeout(timer);

  index = Math.max(0, Math.min(total - 1, nextIndex));

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });

  current.textContent = String(index + 1);
  progressBar.style.width = ((index + 1) / total * 100) + "%";

  prevBtn.style.opacity = index === 0 ? ".35" : "1";
  nextBtn.textContent = index === total - 1 ? "Start Over" : "Next";

  if (index > 7) {
    hint.style.opacity = ".28";
  }

  const auto = slides[index].dataset.auto;
  if (auto && !userInteracted) {
    timer = setTimeout(() => showSlide(index + 1), Number(auto));
  }
}

function next(manual = true) {
  if (index >= total - 1) {
    showSlide(0, manual);
  } else {
    showSlide(index + 1, manual);
  }
}

function prev() {
  showSlide(index - 1, true);
}

nextBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  next(true);
});

prevBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  prev();
});

document.addEventListener("click", (event) => {
  if (event.target.closest("button, input, textarea, label")) return;
  next(true);
});

document.addEventListener("keydown", (event) => {
  if (event.target.matches("input, textarea")) return;
  if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") {
    event.preventDefault();
    next(true);
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    prev();
  }
});

let touchStartX = 0;
document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  if (event.target.closest("button, input, textarea, label")) return;
  const dx = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) {
    dx < 0 ? next(true) : prev();
  }
}, { passive: true });

function setupCopyButton() {
  const btn = document.getElementById("copy-letter");
  if (!btn) return;

  btn.addEventListener("click", async (event) => {
    event.stopPropagation();

    const name = document.getElementById("from").value.trim() || "Saige";
    const letter = document.getElementById("letter").value.trim();
    const status = document.getElementById("copy-status");

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

setupCopyButton();
showSlide(0);
