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

// Loader SVG cycling logic
const loaderIcon = document.getElementById('loaderIcon');
const svgList = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera-icon lucide-camera"><path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"/><circle cx="12" cy="13" r="3"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-film-icon lucide-film"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shirt-icon lucide-shirt"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-watch-icon lucide-watch"><path d="M12 10v2.2l1.6 1"/><path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05"/><path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05"/><circle cx="12" cy="12" r="6"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette-icon lucide-palette"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scissors-icon lucide-scissors"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-person-standing-icon lucide-person-standing"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>`
];
let svgIndex = 0;
let loaderInterval = null;

function startLoaderAnimation() {
  if (!loaderIcon) return;
  svgIndex = Math.floor(Math.random() * svgList.length);
  loaderIcon.innerHTML = svgList[svgIndex];
  loaderInterval = setInterval(() => {
    svgIndex = (svgIndex + 1) % svgList.length;
    loaderIcon.innerHTML = svgList[svgIndex];
  }, 200);
}

function stopLoaderAnimation() {
  if (loaderInterval) {
    clearInterval(loaderInterval);
    loaderInterval = null;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  startLoaderAnimation();
  setTimeout(() => {
    const hint = document.getElementById('scrollHint');
    if (hint) {
      hint.style.opacity = '0';
      hint.style.transition = 'opacity 1s';
      setTimeout(() => { hint.style.display = 'none'; }, 1000);
    }
  }, 3200);

  // Loader logic
  allImagesLoaded(() => {
    stopLoaderAnimation();
    const loader = document.getElementById('pageLoader');
    if (loader) {
      loader.classList.add('hide');
      loader.style.display = 'none'; // Instantly hide
    }
  });
});

carousel.classList.add('ready');

// Loader: Hide when all images are loaded and DOM is ready
function allImagesLoaded(callback) {
  const imgs = carousel.querySelectorAll('img');
  let loaded = 0;
  if (imgs.length === 0) return callback();
  imgs.forEach(img => {
    if (img.complete && img.naturalWidth !== 0) {
      loaded++;
      if (loaded === imgs.length) callback();
    } else {
      img.addEventListener('load', () => {
        loaded++;
        if (loaded === imgs.length) callback();
      });
      img.addEventListener('error', () => {
        loaded++;
        if (loaded === imgs.length) callback();
      });
    }
  });
}
