const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });

reveals.forEach((el) => observer.observe(el));

const car = document.querySelector(".car");

function moveCar() {
  if (!car) return;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (docHeight <= 0) return;

  let scrollPercent = scrollTop / docHeight;
  scrollPercent = Math.max(0, Math.min(1, scrollPercent));

  const maxMove = window.innerWidth * 1.6;
  const moveX = scrollPercent * maxMove;

  car.style.transform = `translateX(${moveX}px)`;
}

let ticking = false;

function onScrollMoveCar() {
  if (ticking) return;
  ticking = true;

  requestAnimationFrame(() => {
    moveCar();
    ticking = false;
  });
}

window.addEventListener("scroll", onScrollMoveCar, { passive: true });

moveCar();

/* -----------------------------
   AUTO SCROLL INTRO
------------------------------ */

let autoScrollStoppedForever = false;
let autoScrollStarted = false;
let autoScrollFrame = null;
let autoScrollTimeout = null;

const AUTO_SCROLL_DELAY = 1200; // wait a bit after load
const AUTO_SCROLL_SPEED = 0.35; // px per frame, very slow

function stopAutoScrollForever() {
  if (autoScrollStoppedForever) return;

  autoScrollStoppedForever = true;
  autoScrollStarted = false;

  if (autoScrollFrame) {
    cancelAnimationFrame(autoScrollFrame);
    autoScrollFrame = null;
  }

  if (autoScrollTimeout) {
    clearTimeout(autoScrollTimeout);
    autoScrollTimeout = null;
  }

  removeStopListeners();
}

function autoScrollStep() {
  if (autoScrollStoppedForever) return;

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  if (window.scrollY >= maxScroll - 2) {
    stopAutoScrollForever();
    return;
  }

  window.scrollBy(0, AUTO_SCROLL_SPEED);
  autoScrollFrame = requestAnimationFrame(autoScrollStep);
}

function startAutoScroll() {
  if (autoScrollStoppedForever || autoScrollStarted) return;

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return;

  autoScrollStarted = true;
  autoScrollFrame = requestAnimationFrame(autoScrollStep);
}

function userInteracted() {
  stopAutoScrollForever();
}

function addStopListeners() {
  window.addEventListener("wheel", userInteracted, { passive: true });
  window.addEventListener("touchstart", userInteracted, { passive: true });
  window.addEventListener("touchmove", userInteracted, { passive: true });
  window.addEventListener("mousedown", userInteracted, { passive: true });
  window.addEventListener("keydown", userInteracted, { passive: true });
  window.addEventListener("scroll", userInteractedOnceScrolledByUser, { passive: true });
}

function removeStopListeners() {
  window.removeEventListener("wheel", userInteracted);
  window.removeEventListener("touchstart", userInteracted);
  window.removeEventListener("touchmove", userInteracted);
  window.removeEventListener("mousedown", userInteracted);
  window.removeEventListener("keydown", userInteracted);
  window.removeEventListener("scroll", userInteractedOnceScrolledByUser);
}

let lastAutoScrollY = window.scrollY;

function userInteractedOnceScrolledByUser() {
  if (!autoScrollStarted || autoScrollStoppedForever) return;

  const currentY = window.scrollY;
  const diff = Math.abs(currentY - lastAutoScrollY);

  // ignore tiny movement from our own auto-scroll
  if (diff > 4) {
    stopAutoScrollForever();
  }

  lastAutoScrollY = currentY;
}

window.addEventListener("load", () => {
  addStopListeners();

  autoScrollTimeout = setTimeout(() => {
    lastAutoScrollY = window.scrollY;
    startAutoScroll();
  }, AUTO_SCROLL_DELAY);
});
