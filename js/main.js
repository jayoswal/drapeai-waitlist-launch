// DrapeAI Panorama Slider using vevet Snap
import { Snap } from "https://esm.sh/vevet@5";

const imageFilenames = window.DRAPE_IMAGES || [];
const carousel = document.getElementById("carousel");


carousel.innerHTML = "";


imageFilenames.forEach((filename) => {
  const slide = document.createElement("div");
  slide.className = "slide";
  slide.style.willChange = "transform"; 
  const img = document.createElement("img");
  img.src = `assets/images/${filename}`;
  img.alt = filename;
  img.onerror = function () {
    this.style.display = "none";
  };
  slide.appendChild(img);
  carousel.appendChild(slide);
});

const snap = new Snap({
  container: carousel,
  direction: "horizontal",
  grabCursor: true,
  centered: true,
  loop: true,
//   gap: 3,
//   freemode: true,
});
window.snap = snap;


let autoScrollTimer;
const minInterval = 50; 
const maxInterval = 2000;
let currentInterval = minInterval;
let spinStartTime = 0;
let isIntroActive = true;
let isInteracting = false;


if (snap) {
  snap.updateProps({
    freemode: false,
    friction: 0, 
    lerp: 0, 
    wheel: true,
    wheelSpeed: 20,
    followWheel: false,
    wheelThrottle: 100,
    wheelAxis: "x",
  });
}

function scheduleNext() {
  if (autoScrollTimer) clearTimeout(autoScrollTimer);

  if (isInteracting && !isIntroActive) return;

  const now = Date.now();
  const elapsed = now - spinStartTime;

  if (elapsed < 4000) {
    // Gradually increase interval (decrease speed) from 200ms to 0ms over 4s
    if (snap && typeof snap.next === "function") {
      snap.next();
    }
    const minSpeed = 200; // slower initial speed
    const maxSpeed = 0;   // end at 0ms (stops)
    currentInterval = Math.max(maxSpeed, minSpeed + (elapsed / 4000) * (maxSpeed - minSpeed));
    autoScrollTimer = setTimeout(scheduleNext, currentInterval);
  } else {
    // After intro: stop auto-scroll and set steady-state physics to 0
    isIntroActive = false;
    if (snap) snap.updateProps({ friction: 0, lerp: 0 }); // Steady state physics (no movement)
    // Do not schedule further auto-scroll
  }
}

function startAutoScroll(reset = false) {
  if (autoScrollTimer) clearTimeout(autoScrollTimer);
  isInteracting = false;

  if (reset) {
    currentInterval = minInterval;
    isIntroActive = true;
    spinStartTime = Date.now();
    // Ultra-smooth physics for intro
    if (snap) snap.updateProps({ friction: 0, lerp: 0 });
    console.log("DrapeAI: Starting Spin at interval", currentInterval);
  }

  // Start immediately with no delay
  scheduleNext();
}

// Interaction Handlers
function onInteractStart() {
  if (isIntroActive) return;
  isInteracting = true;
  if (autoScrollTimer) clearTimeout(autoScrollTimer);
}

function onInteractEnd() {
  if (isIntroActive) return;
  isInteracting = false;
  currentInterval = maxInterval; // Resume at steady speed
  setTimeout(() => {
    if (!isInteracting) startAutoScroll(false);
  }, 500);
}

// Bind events
if (carousel) {
  carousel.addEventListener("mouseenter", onInteractStart);
  carousel.addEventListener("mouseleave", onInteractEnd);
  carousel.addEventListener("touchstart", onInteractStart);
  carousel.addEventListener("touchend", onInteractEnd);
}

if (snap) {
  snap.on("dragstart", onInteractStart);
  snap.on("dragend", onInteractEnd);
}

// --- Hover-based Directional Scrolling (Desktop/Tablet with mouse only) ---
const hoverScrollSpeed = 1200; // Interval in ms (lower = faster). Configurable for tweaking.
let hoverScrollTimer = null;
let currentHoverZone = null; // 'left', 'right', or null

// Check if device supports hover (desktop/tablet with mouse/trackpad)
const supportsHover = window.matchMedia('(hover: hover)').matches;

if (supportsHover && carousel && snap) {
  carousel.addEventListener('mousemove', (e) => {
    // Skip if intro animation is active or user is actively dragging
    if (isIntroActive) return;
    
    const rect = carousel.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const carouselWidth = rect.width;
    const halfWidth = carouselWidth / 2;
    
    // Determine which zone: left or right
    const newZone = mouseX < halfWidth ? 'left' : 'right';
    
    // Only restart timer if zone changed
    if (newZone !== currentHoverZone) {
      currentHoverZone = newZone;
      
      // Clear existing hover scroll timer
      if (hoverScrollTimer) {
        clearInterval(hoverScrollTimer);
      }
      
      // Start hover-based scrolling
      hoverScrollTimer = setInterval(() => {
        if (currentHoverZone === 'right' && typeof snap.next === 'function') {
          snap.next(); // Scroll forward (right to left)
        } else if (currentHoverZone === 'left' && typeof snap.prev === 'function') {
          snap.prev(); // Scroll backward (left to right)
        }
      }, hoverScrollSpeed);
    }
  });
  
  // Stop hover scrolling when mouse leaves carousel
  carousel.addEventListener('mouseleave', () => {
    if (hoverScrollTimer) {
      clearInterval(hoverScrollTimer);
      hoverScrollTimer = null;
    }
    currentHoverZone = null;
  });
}

// Update scroll hint text based on device type and fade in/out timing
const scrollHintText = document.querySelector('.scroll-hint .text');
const scrollHintSection = document.getElementById('scrollHint');
if (scrollHintText && scrollHintSection) {
  // Set text based on device
  if (supportsHover) {
    scrollHintText.textContent = 'HOVER / DRAG TO VIEW MORE';
  } else {
    scrollHintText.textContent = 'DRAG TO VIEW MORE';
  }
  // Initially hide
  scrollHintSection.style.opacity = '0';
  scrollHintSection.style.transition = 'opacity 0.4s';
  // Fade in after 500ms
  setTimeout(() => {
    scrollHintSection.style.opacity = '1';
    // Fade out after 3s (total 3.5s after page load)
    setTimeout(() => {
      scrollHintSection.style.opacity = '0';
    }, 3000);
  }, 800);
}

// Start IMMEDIATELY after window load with minimal delay
window.addEventListener("load", () => {
  console.log("DrapeAI: Window loaded, starting spin...");
  // Reduced delay from 150ms to 50ms for instant start
  setTimeout(() => startAutoScroll(true), 50);
});

// 3D Transform Effect
snap.on("update", () => {
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
    element.style.transform = `translateX(${
      coord + xOffset
    }px) translateZ(${zOffset}px) rotateY(${rotateY}deg)`;
  });
});

// Loader SVG cycling logic
const loaderIcon = document.getElementById("loaderIcon");
console.log("Loader script loaded, loaderIcon:", loaderIcon);
const svgList = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera-icon lucide-camera"><path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"/><circle cx="12" cy="13" r="3"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-film-icon lucide-film"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shirt-icon lucide-shirt"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-watch-icon lucide-watch"><path d="M12 10v2.2l1.6 1"/><path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05"/><path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05"/><circle cx="12" cy="12" r="6"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette-icon lucide-palette"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scissors-icon lucide-scissors"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-person-standing-icon lucide-person-standing"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>`,
];
let svgIndex = 0;
let loaderInterval = null;

function startLoaderAnimation() {
  console.log("startLoaderAnimation called, loaderIcon:", loaderIcon);
  if (!loaderIcon) {
    console.error("loaderIcon not found!");
    return;
  }
  svgIndex = Math.floor(Math.random() * svgList.length);
  loaderIcon.innerHTML = svgList[svgIndex];
  console.log("Initial SVG loaded, starting interval...");
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

// Loader: Hide when all images are loaded
function allImagesLoaded(callback) {
  const imgs = carousel.querySelectorAll("img");
  let loaded = 0;
  if (imgs.length === 0) return callback();
  imgs.forEach((img) => {
    if (img.complete && img.naturalWidth !== 0) {
      loaded++;
      if (loaded === imgs.length) callback();
    } else {
      img.addEventListener("load", () => {
        loaded++;
        if (loaded === imgs.length) callback();
      });
      img.addEventListener("error", () => {
        loaded++;
        if (loaded === imgs.length) callback();
      });
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired");
  // Only show logo and text during loading
  const logoBar = document.querySelector(".logo-bar");
  const heroSection = document.querySelector(".hero-section");
  const footerBar = document.querySelector(".footer-bar");
  const scrollHint = document.getElementById("scrollHint");

  if (logoBar) logoBar.style.display = "";
  if (heroSection) heroSection.style.display = "none";
  if (footerBar) footerBar.style.display = "none";
  if (scrollHint) scrollHint.style.display = "none";

  console.log("Starting loader animation...");
  startLoaderAnimation();

  // Hide scroll hint after 3.2s
  setTimeout(() => {
    const hint = document.getElementById("scrollHint");
    if (hint) {
      hint.style.opacity = "0";
      hint.style.transition = "opacity 1s";
      setTimeout(() => {
        hint.style.display = "none";
      }, 1000);
    }
  }, 3200);

  // Loader logic
  allImagesLoaded(() => {
    stopLoaderAnimation();
    const loader = document.getElementById("pageLoader");
    if (loader) {
      loader.classList.add("hide");
      loader.style.display = "none";
    }
    // Show rest of UI after loading
    if (heroSection) heroSection.style.display = "";
    if (footerBar) footerBar.style.display = "";
    if (scrollHint) scrollHint.style.display = "";
  });
});

carousel.classList.add("ready");

// --- Waitlist Button Loader & Visit Tracking ---
const queueCount = document.getElementById("queueCount");
const loader = document.getElementById("pageLoader");

// 1. Generate or retrieve visit_id from localStorage
function getOrCreateVisitId() {
  let visit_id = localStorage.getItem("drape_visit_id");
  if (!visit_id) {
    visit_id = crypto.randomUUID();
    localStorage.setItem("drape_visit_id", visit_id);
  }
  window.DRAPE_VISIT_ID = visit_id;
  return visit_id;
}

// 2. Parse UTM params from URL
function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_term: params.get("utm_term") || "",
    utm_content: params.get("utm_content") || "",
    referrer: document.referrer || "",
  };
}

// 3. Get User-Agent
const user_agent = navigator.userAgent;

// 4. Get IP and geo details (via backend proxy to avoid CORS issues)
async function getIPGeo() {
  try {
    const res = await fetch("/api/geo");
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    return {
      ip: data.ip || "",
      ip_details: data.ip_details || ""
    };
  } catch {
    return { ip: "", ip_details: "" };
  }
}

// 5. Send to /api/visit and update button
async function initWaitlistButton() {
  const utms = getUTMParams();
  const { ip, ip_details } = await getIPGeo();
  const payload = {
    visit_id: getOrCreateVisitId(),
    ...utms,
    user_agent,
    ip,
    ip_details,
  };

  let timeout;
  let updated = false;

  // Fallback after 2s
  timeout = setTimeout(() => {
    if (!updated) {
      if (loader) loader.style.display = "none";
      if (queueCount) queueCount.textContent = "";
      const btn = document.getElementById("joinWaitlistBtn");
      if (btn) btn.innerHTML = "Join Waitlist Now";
    }
  }, 2000);

  try {
    const res = await fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data && typeof data.waitlist_number === "number") {
      updated = true;
      clearTimeout(timeout);
      if (loader) loader.style.display = "none";
      if (queueCount) queueCount.textContent = data.waitlist_number;
    }
  } catch {
    // fallback handled by timeout
  }
}

window.addEventListener("DOMContentLoaded", initWaitlistButton);

// --- Waitlist Form Submission ---
const waitlistForm = document.getElementById("waitlistForm");
// Country code to calling code mapping
const countryCodeMap = {
  'IN': '+91', 'US': '+1', 'GB': '+44', 'CA': '+1', 'AU': '+61',
  'SG': '+65', 'DE': '+49', 'FR': '+33', 'IT': '+39', 'ES': '+34',
  'CN': '+86', 'JP': '+81', 'BR': '+55', 'ZA': '+27', 'RU': '+7',
  'MX': '+52', 'AE': '+971', 'KR': '+82', 'SA': '+966', 'ID': '+62',
  'PK': '+92', 'BD': '+880', 'NG': '+234', 'EG': '+20', 'TR': '+90',
  'TH': '+66', 'MY': '+60', 'PH': '+63', 'VN': '+84', 'UA': '+380',
  'PL': '+48', 'AR': '+54', 'CO': '+57', 'CL': '+56', 'NZ': '+64',
  'SE': '+46', 'NO': '+47', 'FI': '+358', 'DK': '+45', 'IE': '+353',
  'CH': '+41', 'BE': '+32', 'NL': '+31', 'AT': '+43', 'GR': '+30',
  'PT': '+351', 'CZ': '+420', 'HU': '+36', 'RO': '+40', 'SK': '+421',
  'BG': '+359', 'HR': '+385', 'SI': '+386', 'LT': '+370', 'LV': '+371',
  'EE': '+372', 'LU': '+352', 'IS': '+354', 'MT': '+356', 'CY': '+357',
  'LI': '+423'
};

const joinWaitlistBtn = document.getElementById("joinWaitlistBtn");

if (waitlistForm) {
  waitlistForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("modalEmail")?.value || "";
    const phone = document.getElementById("modalPhone")?.value || "";
    const countryCode = document.getElementById("modalCountry")?.value || "";
    
    // Structure phone as JSON object
    const phoneData = {
      country_code: countryCodeMap[countryCode] || "+91",
      phone: phone
    };
    
    const user_agent = navigator.userAgent;
    let ip = "";
    let ip_details = "";
    try {
      const geo = await getIPGeo();
      ip = geo.ip;
      ip_details = geo.ip_details;
    } catch {}
    const visit_id = getOrCreateVisitId();
    const payload = {
      visit_id,
      email,
      phone: JSON.stringify(phoneData),
      user_agent,
      ip,
      ip_details,
    };
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data && typeof data.waitlist_number === "number") {
        if (joinWaitlistBtn)
          joinWaitlistBtn.innerHTML = `<span class="number" id="queueCount">${data.waitlist_number}</span> Already in Waitlist, Click to Join`;
      }
    } catch {}
    // Show success message/modal
    const modalSuccess = document.getElementById("modalSuccess");
    const modalFormSection = document.getElementById("modalFormSection");
    if (modalSuccess && modalFormSection) {
      modalFormSection.style.display = "none";
      modalSuccess.style.display = "";
    }
  });
}

// --- Waitlist Modal Button Enable/Disable Logic ---
const modalEmail = document.getElementById('modalEmail');
const modalPhone = document.getElementById('modalPhone');
const modalSubmit = document.querySelector('.modal-submit');

function validateModalForm() {
  const email = modalEmail?.value.trim();
  const phone = modalPhone?.value.trim();
  // Basic validation: both fields non-empty and email contains @
  const valid = email && email.includes('@') && phone && phone.length >= 10;
  if (modalSubmit) modalSubmit.disabled = !valid;
}

if (modalEmail && modalPhone && modalSubmit) {
  modalSubmit.disabled = true;
  modalEmail.addEventListener('input', validateModalForm);
  modalPhone.addEventListener('input', validateModalForm);
}

// --- Auto-scroll carousel on page load after images and waitlist_number are loaded ---
function autoScrollCarousel() {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;
  let start = null;
  const duration = 1200; // ms
  const scrollAmount = carousel.scrollWidth / 3; // scroll by 1/3 of carousel width
  const initialScroll = carousel.scrollLeft;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    carousel.scrollLeft = initialScroll + scrollAmount * progress;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

// Wait for images and waitlist_number, then auto-scroll
function onImagesAndWaitlistLoaded(callback) {
  let imagesLoaded = false;
  let waitlistLoaded = false;
  function check() {
    if (imagesLoaded && waitlistLoaded) callback();
  }
  // Images
  const imgs = document.querySelectorAll('#carousel img');
  let loadedCount = 0;
  if (imgs.length === 0) imagesLoaded = true;
  imgs.forEach(img => {
    if (img.complete) {
      loadedCount++;
      if (loadedCount === imgs.length) {
        imagesLoaded = true;
        check();
      }
    } else {
      img.addEventListener('load', () => {
        loadedCount++;
        if (loadedCount === imgs.length) {
          imagesLoaded = true;
          check();
        }
      });
      img.addEventListener('error', () => {
        loadedCount++;
        if (loadedCount === imgs.length) {
          imagesLoaded = true;
          check();
        }
      });
    }
  });
  if (imgs.length === 0) check();
  // Waitlist number
  const origInitWaitlistButton = window.initWaitlistButton;
  window.initWaitlistButton = async function() {
    await origInitWaitlistButton();
    waitlistLoaded = true;
    check();
  };
}

onImagesAndWaitlistLoaded(autoScrollCarousel);
