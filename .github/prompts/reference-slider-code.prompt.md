---
mode: agent
---
Below is the reference code for the image slider called 'Panorama Slider'

```HTML
<!-- Swiper reproduction -->
<!-- https://panorama-slider.uiinitiative.com/ -->

<div class="carousel" id="carousel">
  <div class="slide">
    <img src="https://picsum.photos/id/758/400/600" alt="">
  </div>
  <div class="slide">
    <img src="https://picsum.photos/id/760/400/600" alt="">
  </div>
  <div class="slide">
    <img src="https://picsum.photos/id/770/400/600" alt="">
  </div>
  <div class="slide">
    <img src="https://picsum.photos/id/780/400/600" alt="">
  </div>
  <div class="slide">
    <img src="https://picsum.photos/id/790/400/600" alt="">
  </div>
  <div class="slide">
    <img src="https://picsum.photos/id/800/400/600" alt="">
  </div>
  <div class="slide">
    <img src="https://picsum.photos/id/810/400/600" alt="">
  </div>
  <div class="slide">
    <img src="https://picsum.photos/id/820/400/600" alt="">
  </div>
  <div class="slide">
    <img src="https://picsum.photos/id/830/400/600" alt="">
  </div>
  <div class="slide">
    <img src="https://picsum.photos/id/840/400/600" alt="">
  </div>
</div>
```

```CSS
body {
  background: linear-gradient(
    165deg,
    rgb(17, 25, 42) 0%,
    rgb(30, 43, 82) 40%,
    rgb(0, 58, 82) 100%
  );
}

.carousel {
  --size: max(30vw, 30vh);

  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: var(--size);

  perspective: calc(var(--size) * 5.55);
  transform-style: preserve-3d;

  opacity: 0;
  transition: opacity 0.25s linear;
}

.carousel.ready {
  opacity: 1;
}

.slide {
  position: absolute;
  width: calc(var(--size) * 0.6);
  height: var(--size);
  border-radius: 0px;
  overflow: hidden;
  box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.1);
}

.slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
```

```JS
import { Snap, vevet } from "https://esm.sh/vevet@5";

const container = document.getElementById("carousel");

const carousel = new Snap({
  container,
  direction: "horizontal",
  grabCursor: true,
  centered: true,
  loop: true,
  gap: 10,
  freemode: true
});

carousel.on("update", () => {
  const depth = 200;
  const rotation = 20;
  const scale = 1 / (180 / rotation);
  const halfAngle = (rotation * Math.PI) / 180 / 2;

  carousel.slides.forEach(({ element, coord, progress, size }) => {
    const factor = 1 - Math.cos(progress * scale * Math.PI);

    const xOffset = progress * (size / 3) * factor;
    const zOffset = ((size * 0.5) / Math.sin(halfAngle)) * factor - depth;
    const rotateY = progress * rotation;

    element.style.transform = `translateX(${
      coord + xOffset
    }px) translateZ(${zOffset}px) rotateY(${rotateY}deg)`;
  });
});

container.classList.add("ready");
```

## Features of this slider
- infinite scroll effect
- smooth scroll
- edges of the images elongate giving it panoramic effect

## WHY UNDERSTANDING THIS DOCUMENT?
Analyze the slider effect and how it is working smooth, we have to replicate this onto our website. We will have our images stored in a separate directory.