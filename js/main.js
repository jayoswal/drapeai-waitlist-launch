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
  img.onerror = function() {
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
  freemode: true
});

snap.on('update', () => {
  const depth = 200;
  const rotation = 20;
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

carousel.classList.add('ready');
