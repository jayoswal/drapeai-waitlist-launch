// DrapeAI Panorama Slider using vevet Snap
import { Snap } from "https://esm.sh/vevet@5";

const imageFilenames = window.DRAPE_IMAGES || [];
const carousel = document.getElementById('carousel');

// Clear carousel
carousel.innerHTML = '';

// Dynamically create slide elements
imageFilenames.forEach(filename => {
  const slide = document.createElement('div');
  slide.className = 'slide';
  const img = document.createElement('img');
  img.src = `assets/images/${filename}`;
  img.alt = filename;
  img.onerror = function () {
    this.style.display = 'none';
  };
  slide.appendChild(img);
  carousel.appendChild(slide);
});

const snap = new Snap({
  container: carousel,
  direction: 'horizontal',
  grabCursor: true,
  centered: true,
  loop: true,
  gap: 3,
  freemode: false,
  slideToScroll: 1,
  centered: true,
  lerp: 0.1,
  friction: 0.1,
//   friction: 1,
//   lerp: 1,
//   edgeFriction: 1
});
window.snap = snap;

// Enable mouse wheel to control the slider directionally (using Snap's built-in wheel prop)
snap.updateProps({
  wheel: true,
  wheelSpeed: 20, // adjust for natural feel
  followWheel: false,
  wheelThrottle: 100,
  wheelAxis: 'x',
});

snap.on('update', () => {
  // Responsive 3D effect: more dramatic on small screens
  const isSmall = window.innerWidth < 600;
  const depth = isSmall ? 320 : 200;
  const rotation = isSmall ? 36 : 20;
  const scale = 1 / (180 / rotation);
  const halfAngle = (rotation * Math.PI) / 180 / 2;

  snap.slides.forEach(({ element, coord, progress, size }) => {
    const factor = 1 - Math.cos(progress * scale * Math.PI);
    const xOffset = progress * (size / 3) * factor;
    const zOffset = ((size * 0.5) / Math.sin(halfAngle)) * factor - depth;
    const rotateY = progress * rotation;
    element.style.transform = `translateX(${coord + xOffset}px) translateZ(${zOffset}px) rotateY(${rotateY}deg)`;
  });
});

// Fade out scroll hint after 5 seconds
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const hint = document.getElementById('scrollHint');
    if (hint) {
      hint.style.opacity = '0';
      hint.style.transition = 'opacity 1s';
      setTimeout(() => { hint.style.display = 'none'; }, 1000);
    }
  }, 3000);
});

carousel.classList.add('ready');
