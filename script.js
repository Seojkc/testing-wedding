const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });

reveals.forEach(el => observer.observe(el));


const car = document.querySelector(".car");

function moveCar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (docHeight <= 0) return; // prevent divide issues

  let scrollPercent = scrollTop / docHeight;

  // clamp between 0 and 1
  scrollPercent = Math.max(0, Math.min(1, scrollPercent));

  const maxMove = window.innerWidth * 1.6; // allow full travel

  const moveX = scrollPercent * maxMove;

  car.style.transform = `translateX(${moveX}px)`;
}

// smoother than scroll event
window.addEventListener("scroll", () => {
  requestAnimationFrame(moveCar);
});

// run once on load
moveCar();