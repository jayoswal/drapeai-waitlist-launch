# Hover-Based Directional Scrolling

## Date: January 1, 2026

---

## Overview

Added hover-based directional scrolling to the carousel that allows users to control scroll direction by hovering over different areas of the carousel.

**Device Support:** Desktop and tablets with mouse/trackpad only (detected via `matchMedia('(hover: hover)')`)

---

## How It Works

### **Hover Zones:**

```
┌─────────────────────────────────────┐
│                                     │
│    LEFT HALF    │    RIGHT HALF     │
│   (Scroll ←)    │    (Scroll →)     │
│                                     │
└─────────────────────────────────────┘
       50%                 50%
```

- **Hover on LEFT half** → Scrolls **backward** (left to right) using `snap.prev()`
- **Hover on RIGHT half** → Scrolls **forward** (right to left) using `snap.next()`
- **Mouse leave** → Stops hover scrolling

---

## Behavior

### **1. Works Alongside Existing Logic:**
- ✅ Does NOT pause or replace intro animation
- ✅ Does NOT interfere with auto-scroll
- ✅ Does NOT pause on hover (only on click/drag)
- ✅ Adds directional control while hovering

### **2. Device Detection:**
- Uses `window.matchMedia('(hover: hover)')` to detect hover capability
- Only activates on devices with mouse/trackpad
- Mobile/touch devices are excluded (no hover support)

### **3. Smooth Integration:**
- Respects intro animation (skips during 4-second intro)
- Works with existing drag/touch interactions
- Cleans up timer on mouse leave

---

## Configuration

### **Adjustable Speed:**

Located in `js/main.js` (around line 128):

```javascript
const hoverScrollSpeed = 100; // Interval in ms (lower = faster)
```

**Speed Guidelines:**
- `50ms` = Very fast scrolling
- `100ms` = Default speed (moderate)
- `200ms` = Slower scrolling
- `500ms` = Very slow scrolling

**To adjust:** Change the value and test on desktop/tablet with mouse.

---

## Code Implementation

### **File:** `js/main.js`

**Location:** After interaction handlers (lines ~128-180)

**Key Components:**

1. **Speed Configuration:**
   ```javascript
   const hoverScrollSpeed = 100;
   ```

2. **State Variables:**
   ```javascript
   let hoverScrollTimer = null;
   let currentHoverZone = null; // 'left', 'right', or null
   ```

3. **Device Detection:**
   ```javascript
   const supportsHover = window.matchMedia('(hover: hover)').matches;
   ```

4. **Hover Zone Detection:**
   ```javascript
   const rect = carousel.getBoundingClientRect();
   const mouseX = e.clientX - rect.left;
   const halfWidth = rect.width / 2;
   const newZone = mouseX < halfWidth ? 'left' : 'right';
   ```

5. **Directional Scrolling:**
   ```javascript
   if (currentHoverZone === 'right') {
     snap.next(); // Forward
   } else if (currentHoverZone === 'left') {
     snap.prev(); // Backward
   }
   ```

---

## Event Flow

### **Mouse Move on Carousel:**

```
User hovers → Calculate mouse position → Determine zone (left/right)
              ↓
         Zone changed?
              ↓
         Clear old timer → Start new interval
              ↓
         Continuously call snap.next() or snap.prev()
```

### **Mouse Leave Carousel:**

```
User leaves → Clear interval → Reset currentHoverZone to null
```

---

## Examples

### **Example 1: Slow Scrolling**
```javascript
const hoverScrollSpeed = 300; // 300ms interval = slow
```

### **Example 2: Fast Scrolling**
```javascript
const hoverScrollSpeed = 50; // 50ms interval = fast
```

### **Example 3: Disable Feature**
```javascript
// Simply remove or comment out the entire hover scrolling block
```

---

## Browser Compatibility

### **Supported:**
- ✅ Chrome (Desktop/Tablet with mouse)
- ✅ Firefox (Desktop/Tablet with mouse)
- ✅ Safari (Desktop/Tablet with trackpad)
- ✅ Edge (Desktop/Tablet with mouse)

### **Not Activated:**
- ❌ Mobile phones (no hover support)
- ❌ Touch-only tablets
- ❌ Any device without hover capability

---

## Testing

### **Test on Desktop:**

1. Open the site on a desktop browser
2. Hover over the LEFT half of the carousel → Should scroll backward
3. Hover over the RIGHT half of the carousel → Should scroll forward
4. Move mouse between left/right → Direction should change smoothly
5. Leave carousel → Hovering should stop

### **Test on Mobile:**

1. Open the site on a mobile device
2. Hover scrolling should NOT activate
3. Touch/swipe interactions should work normally

### **Test During Intro:**

1. Refresh the page
2. Immediately hover on carousel during 4-second intro
3. Hover scrolling should NOT activate (waits for intro to finish)

---

## Performance

### **Optimizations:**

1. **Zone change detection:** Only restarts timer when moving between left/right zones
2. **Intro check:** Skips during intro animation to avoid conflicts
3. **Device detection:** Only adds listeners on hover-capable devices
4. **Cleanup:** Properly clears intervals on mouse leave

### **Impact:**

- ✅ Minimal performance impact (single `setInterval` per hover)
- ✅ No visual jank or stuttering
- ✅ Works smoothly alongside existing animations

---

## Troubleshooting

### **Issue: Not working on mobile**
**Solution:** This is expected. Feature only works on devices with hover capability (desktop/tablet with mouse).

### **Issue: Too fast/slow**
**Solution:** Adjust `hoverScrollSpeed` value in `js/main.js`.

### **Issue: Conflicts with drag**
**Solution:** Feature respects existing drag/touch interactions. Drag continues to work normally.

### **Issue: Not activating during intro**
**Solution:** This is intentional. Hover scrolling waits for 4-second intro to complete.

---

## Future Enhancements (Optional)

### **Possible Additions:**

1. **Visual feedback:** Change cursor or add subtle highlight when hovering zones
2. **Variable speed:** Scroll faster the further from center you hover
3. **Dead zone:** Add small center area with no scrolling
4. **Momentum:** Gradually accelerate scroll speed while hovering

### **To Implement Visual Feedback (CSS):**

```css
.carousel:hover {
  cursor: e-resize; /* Show directional cursor */
}
```

---

## Summary

### **What Was Added:**
- ✅ Hover-based directional scrolling
- ✅ 50/50 split (left = backward, right = forward)
- ✅ Desktop/tablet with mouse only (matchMedia detection)
- ✅ Configurable speed via `hoverScrollSpeed` variable
- ✅ Works alongside existing auto-scroll and intro animation

### **Benefits:**
- Enhanced user control on desktop
- Intuitive left/right directional navigation
- No interference with existing functionality
- Easy to adjust speed or disable

### **Configuration:**
- Speed setting: `hoverScrollSpeed = 100` (in `js/main.js`)
- Lower value = faster scrolling
- Higher value = slower scrolling

