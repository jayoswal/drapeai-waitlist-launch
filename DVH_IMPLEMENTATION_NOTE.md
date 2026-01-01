# DVH (Dynamic Viewport Height) Implementation Note

## Date: January 1, 2026

---

## What Changed

Converted all `vh` (viewport height) units to `dvh` (dynamic viewport height) for the 6 main elements' positioning.

---

## Why DVH?

### Problem with VH:
- `100vh` = full screen height including browser UI (address bar, toolbars, navigation)
- On mobile, browser UI can take up 10-20% of screen space
- Elements positioned with `vh` can be hidden behind browser bars
- Layout doesn't adapt when mobile browser UI shows/hides on scroll

### Solution with DVH:
- `100dvh` = actual visible viewport height (excluding browser UI)
- Updates dynamically as browser UI shows/hides
- Elements always remain visible in the actual viewable area
- Better mobile experience

---

## Elements Updated

All 6 main elements now use `dvh` instead of `vh`:

### 1. Logo Bar
```css
top: clamp(4dvh, 5dvh, 6dvh);
```

### 2. Scroll Hint
```css
top: clamp(17dvh, 17dvh, 22dvh);
```

### 3. Carousel
```css
top: clamp(22dvh, 7dvh, 25dvh);
--size: clamp(30dvh, 35dvh, 40dvh);
```

### 4. Tagline
```css
top: clamp(59dvh, 63dvh, 65dvh);
```

### 5. Waitlist Button
```css
top: clamp(74dvh, 76dvh, 82dvh);
```

### 6. Footer
```css
bottom: clamp(1dvh, 2dvh, 3dvh);
```

---

## Browser Support

- **Modern Browsers**: Full support (Chrome 108+, Safari 15.4+, Firefox 101+)
- **Fallback**: Browsers without `dvh` support will ignore these rules
- **Recommendation**: Keep testing across devices

---

## Expected Behavior

### Desktop:
- No noticeable difference (minimal browser UI)
- Layout remains consistent

### Mobile:
- Layout adapts to visible area
- Elements remain accessible when browser UI shows/hides
- Better use of screen real estate
- No elements hidden behind address bar or navigation

### Mobile Safari Specifically:
- Address bar hides on scroll down
- Available space increases dynamically
- Layout smoothly adjusts

---

## Testing Checklist

- [ ] Test on iOS Safari (iPhone)
- [ ] Test on Android Chrome
- [ ] Test in landscape mode
- [ ] Test with browser in fullscreen mode
- [ ] Test scrolling behavior (browser UI hide/show)
- [ ] Verify no overlap between button and footer
- [ ] Check all elements remain visible

---

## Notes

- `dvh` is the recommended approach for mobile-first layouts
- Alternative units available: `svh` (small viewport height), `lvh` (large viewport height)
- Current implementation uses dynamic behavior for best UX
- All positioning values are identical to previous `vh` values, just using `dvh` unit

---

## Rollback

If `dvh` causes issues, revert by replacing all `dvh` with `vh` in the 6 elements listed above.

