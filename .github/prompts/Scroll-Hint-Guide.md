# Scroll Hint Text Documentation

## Overview
This document details the scroll hint/instruction text that guides users on how to interact with the image carousel. It includes content, visual design, typography, positioning, and animation behavior.

---

## Table of Contents
1. [Component Overview](#component-overview)
2. [Content Structure](#content-structure)
3. [Typography](#typography)
4. [Color Scheme](#color-scheme)
5. [Visual Effects](#visual-effects)
6. [Layout Design](#layout-design)
7. [Animation Behavior](#animation-behavior)
8. [Design Rationale](#design-rationale)
9. [Customization Guide](#customization-guide)

---

## Component Overview

### Purpose
The scroll hint provides instructional guidance to users, indicating that the carousel is interactive and can be scrolled or dragged in multiple directions.

### Key Features
- **Directional Arrows**: Visual indicators (↑ ← ● → ↓)
- **Instructional Text**: "SCROLL/DRAG TO VIEW MORE"
- **Auto-Fade**: Disappears after 6 seconds
- **Subtle Appearance**: Semi-transparent for non-intrusive guidance
- **Positioned Above Carousel**: Clear association with interactive element

---

## Content Structure

### HTML Structure
```vue
<div class="scroll-hint">
  <div class="arrows">
    <div class="top">↑</div>
    <div class="middle">
      <div>←</div>
      <div>●</div>
      <div>→</div>
    </div>
    <div class="bottom">↓</div>
  </div>
  <div class="text">SCROLL/DRAG TO VIEW MORE</div>
</div>
```

### Visual Layout
```
       ↑
    ← ● →
       ↓
SCROLL/DRAG TO VIEW MORE
```

### Content Breakdown

#### Arrow Section
```
    ↑       (up arrow)
  ← ● →     (left, center dot, right arrow)
    ↓       (down arrow)
```

**Unicode Characters**:
- **↑** (U+2191) - Upwards Arrow
- **←** (U+2190) - Leftwards Arrow  
- **●** (U+25CF) - Black Circle (center point)
- **→** (U+2192) - Rightwards Arrow
- **↓** (U+2193) - Downwards Arrow

**Purpose**: Visual representation of scroll directions

#### Text Content
```
SCROLL/DRAG TO VIEW MORE
```

**Content Details**:
- **"SCROLL"**: Mouse wheel or trackpad action
- **"DRAG"**: Click and drag or touch gesture
- **"TO VIEW MORE"**: Indicates there's more content
- **All Caps**: Creates visual emphasis and clarity

---

## Typography

### Font Family
```css
font-family: 'Plus Jakarta Sans', sans-serif;
```

**Font Details**:
- **Name**: Plus Jakarta Sans
- **Source**: Google Fonts
- **Type**: Modern geometric sans-serif
- **Character**: Clean, readable, contemporary

**Consistency**: Same font used for tagline and button

### Font Weight
```css
font-weight: bold;
```

**Weight Value**: 700 (Bold)

**Purpose**:
- Ensures visibility at small size
- Creates emphasis
- Improves readability
- Professional appearance

### Font Style
```css
font-style: normal;
```

- Not italic
- Upright letterforms
- Clear, direct communication

### Text Case
```css
text-transform: uppercase; /* Applied via content */
```

**All Caps**: "SCROLL/DRAG TO VIEW MORE"

**Why Uppercase?**:
- **Attention**: Caps draw more attention
- **Clarity**: All caps easier to read at small sizes
- **Emphasis**: Indicates instructional content
- **Modern**: Contemporary UI pattern

### Text Alignment
```css
text-align: center;
```

- Centers text within container
- Balanced with arrow arrangement
- Professional appearance

---

## Color Scheme

### Text Color
```css
color: #43423e;
```

**Color Details**:
- **Hex**: #43423e
- **Name**: Dark charcoal / Warm gray
- **RGB**: rgb(67, 66, 62)
- **HSL**: hsl(40, 4%, 25%)

**Color Analysis**:
- **Hue**: Warm (yellow undertone)
- **Saturation**: Very low (4%)
- **Lightness**: Dark (25%)
- **Temperature**: Warm, professional

**Consistency**:
- Same as brand name (#43423e)
- Same as tagline (#43423e)
- Same as button background (#43423e)
- Part of cohesive color palette

### Color Psychology
- **Professional**: Serious, authoritative
- **Sophisticated**: Muted, refined
- **Readable**: Good contrast on light background
- **Harmonious**: Matches overall design system

---

## Visual Effects

### Opacity
```css
opacity: 0.5;
```

**Transparency Level**: 50% opacity

**Purpose**:
- **Subtle**: Doesn't compete with main content
- **Non-intrusive**: Guides without demanding attention
- **Elegant**: Refined, sophisticated appearance
- **Readable**: Still visible enough to be useful

**Effect**: Text appears ghosted but legible

### Fade-Out Animation
```javascript
setTimeout(() => {
  gsap.to('.scroll-hint', { opacity: 0, duration: 1 })
}, 6000)
```

**Animation Details**:
- **Delay**: 6 seconds (6000ms)
- **Duration**: 1 second fade
- **Target**: opacity: 0 (completely transparent)
- **Easing**: Default (ease) - smooth curve

**Timeline**:
1. **0-6s**: Visible at 50% opacity
2. **6-7s**: Fades from 50% to 0%
3. **7s+**: Completely invisible

**Purpose**:
- Guides new users initially
- Disappears once user likely understands
- Reduces visual clutter after introduction
- Progressive disclosure UX pattern

---

## Layout Design

### Container Layout
```css
.scroll-hint {
  display: flex;
  flex-direction: row;
  align-items: center;
}
```

**Layout System**: Flexbox (horizontal)

**Properties**:
- **flex-direction: row**: Arrows left, text right
- **align-items: center**: Vertical alignment
- **Arrangement**: `[Arrows] [Text]`

### Arrow Section Layout
```css
.arrows {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 8px;
}
```

**Arrow Arrangement**:
- **flex-direction: column**: Stacked vertically
- **align-items: center**: Horizontally centered
- **margin-right: 8px**: Space between arrows and text

### Middle Row Layout
```css
.middle {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
}
```

**Middle Arrow Row**: `← ● →`
- **flex-direction: row**: Horizontal arrangement
- **gap: 2px**: Small space between elements
- **Compact**: Tight spacing for visual unity

---

## Positioning

### Absolute Positioning
```css
.scroll-hint {
  position: absolute;
  top: calc(50% - 350px/2 - 65px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}
```

**Positioning Strategy**:
- **Absolute**: Positioned relative to viewport
- **Horizontal Center**: `left: 50%` + `translateX(-50%)`
- **Above Carousel**: Positioned above image slider
- **Z-index: 1**: Above background, below slider

**Visual Placement**: Directly above carousel to indicate what it controls

---

## Design Rationale

### Why This Content?

#### "SCROLL/DRAG TO VIEW MORE"
- **Clear Action**: Tells exactly what to do
- **Multiple Methods**: Covers scroll wheel, drag, and touch
- **Outcome**: "VIEW MORE" indicates benefit
- **Concise**: Short enough to read quickly
- **Universal**: Works for all interaction types

### Why Arrow Symbols?

#### Visual Communication
- **Universal**: Arrows understood globally
- **Non-verbal**: No language barrier
- **Directional**: Clearly shows movement options
- **Compact**: Takes minimal space
- **Familiar**: Standard UI pattern

#### Arrow Arrangement
```
    ↑
  ← ● →
    ↓
```
- **Cross Pattern**: Shows all directions
- **Center Dot**: Represents starting point
- **Balanced**: Symmetrical, professional
- **Clear**: Easy to understand at a glance

### Why Fade Out?

#### User Experience Benefits
1. **Initial Guidance**: Helps first-time users
2. **Non-intrusive**: Doesn't stay in the way
3. **Clean UI**: Reduces clutter after understanding
4. **Progressive Disclosure**: Information when needed
5. **Professional**: Polished, thoughtful design

#### Timing Choice (6 seconds)
- Long enough to be noticed and read
- Short enough not to be annoying
- Assumes user will interact or move on
- Industry standard for temporary UI hints

### Why 50% Opacity?

#### Balance
- **Visible**: Can be seen and read
- **Subtle**: Doesn't dominate interface
- **Professional**: Refined, not harsh
- **Hierarchy**: Less important than main content
- **Elegant**: Sophisticated appearance

**Not 100%**: Would be too bold, intrusive
**Not 30%**: Would be too faint, hard to read
**50%**: Sweet spot for guidance

---

## Accessibility Considerations

### Visual Accessibility

#### Color Contrast
```
Text: #43423e at 50% opacity = approximately #9e9d99
Background: #f9f7ec
Effective Contrast: ~3:1
```

**Note**: At 50% opacity, contrast is reduced
- Passes WCAG AA for large text
- Intentionally subtle (temporary hint)
- Fades away, not critical content

#### Alternatives for Screen Readers
```html
<div class="scroll-hint" aria-label="Interactive carousel: scroll or drag to view more images">
  <!-- visual content -->
</div>
```

### Interaction Clarity
- **Multiple Cues**: Both visual (arrows) and text
- **Universal Symbols**: Arrows recognized globally
- **Clear Language**: Simple, direct instruction

---

## Customization Guide

### Change Text Content

#### Shorter Text
```html
<div class="text">DRAG TO EXPLORE</div>
```

#### More Descriptive
```html
<div class="text">SCROLL OR DRAG HORIZONTALLY</div>
```

#### Different Language
```html
<div class="text">FAITES DÉFILER POUR EN VOIR PLUS</div>
```

### Change Arrow Style

#### Different Symbols
```html
<div class="arrows">
  <div class="top">⬆</div>
  <div class="middle">
    <div>⬅</div>
    <div>●</div>
    <div>➡</div>
  </div>
  <div class="bottom">⬇</div>
</div>
```

#### Hand Emoji
```html
<div class="arrows">
  <div class="middle">
    <div>👆</div>
  </div>
</div>
<div class="text">SWIPE TO EXPLORE</div>
```

### Change Opacity

#### More Prominent
```css
.scroll-hint {
  opacity: 0.7; /* 70% visible */
}
```

#### More Subtle
```css
.scroll-hint {
  opacity: 0.3; /* 30% visible */
}
```

#### Fully Opaque
```css
.scroll-hint {
  opacity: 1; /* 100% visible */
}
```

### Change Color

#### Lighter Color
```css
.scroll-hint {
  color: #6b7280; /* Medium gray */
}
```

#### Accent Color
```css
.scroll-hint {
  color: #6366f1; /* Indigo blue */
}
```

#### Match Button Color
```css
.scroll-hint {
  color: #43423e; /* Already matches! */
}
```

### Change Font Weight

#### Regular Weight
```css
.scroll-hint {
  font-weight: normal; /* 400 */
}
```

#### Extra Bold
```css
.scroll-hint {
  font-weight: 800;
}
```

### Change Fade Timing

#### Faster Fade (3 seconds)
```javascript
setTimeout(() => {
  gsap.to('.scroll-hint', { opacity: 0, duration: 1 })
}, 3000)
```

#### Longer Display (10 seconds)
```javascript
setTimeout(() => {
  gsap.to('.scroll-hint', { opacity: 0, duration: 1 })
}, 10000)
```

#### No Auto-Fade (Remove Timer)
```javascript
// Comment out or remove the setTimeout completely
// User hint stays visible permanently
```

#### Fade on Interaction
```javascript
const handleFirstInteraction = () => {
  gsap.to('.scroll-hint', { opacity: 0, duration: 0.5 })
}

// Add to mouse/touch handlers
```

### Add Background

#### Subtle Background
```css
.scroll-hint {
  background-color: rgba(249, 247, 236, 0.8);
  padding: 8px 12px;
  border-radius: 5px;
}
```

#### Border Style
```css
.scroll-hint {
  border: 1px solid rgba(67, 66, 62, 0.2);
  padding: 8px 12px;
  border-radius: 5px;
}
```

### Add Animation

#### Pulse Effect
```css
@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

.scroll-hint {
  animation: pulse 2s infinite;
}
```

#### Bounce Effect
```css
@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-5px); }
}

.scroll-hint {
  animation: bounce 2s infinite;
}
```

#### Fade In on Load
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 0.5; }
}

.scroll-hint {
  animation: fadeIn 1s ease-in;
}
```

---

## Alternative Designs

### Minimal Text Only
```html
<div class="scroll-hint">
  <div class="text">SCROLL →</div>
</div>
```

### Icon + Text
```html
<div class="scroll-hint">
  <span class="icon">👆</span>
  <div class="text">SWIPE</div>
</div>
```

### Horizontal Arrows Only
```html
<div class="scroll-hint">
  <div class="arrows">
    ← DRAG →
  </div>
</div>
```

### Two-Line Text
```html
<div class="scroll-hint">
  <div class="text">
    SCROLL OR DRAG<br>
    TO VIEW MORE
  </div>
</div>
```

---

## Summary

### Content
- ✅ **Text**: "SCROLL/DRAG TO VIEW MORE"
- ✅ **Arrows**: ↑ ← ● → ↓ (directional indicators)
- ✅ **Format**: Uppercase text for emphasis
- ✅ **Layout**: Arrows left, text right

### Typography
- ✅ **Font**: Plus Jakarta Sans
- ✅ **Weight**: Bold (700)
- ✅ **Style**: Normal (not italic)
- ✅ **Case**: Uppercase

### Color & Effects
- ✅ **Color**: #43423e (dark charcoal)
- ✅ **Opacity**: 0.5 (50% transparent)
- ✅ **Fade**: Auto-disappears after 6 seconds
- ✅ **Animation**: 1-second smooth fade-out

### Design Purpose
- ✅ **Guides users**: Clear interaction instructions
- ✅ **Non-intrusive**: Subtle, semi-transparent
- ✅ **Progressive**: Fades after initial viewing
- ✅ **Universal**: Arrows + text for clarity
- ✅ **Professional**: Polished, refined appearance

### Positioning
- ✅ **Above Carousel**: Clear association
- ✅ **Centered**: Horizontally aligned
- ✅ **Z-index**: Layered properly
- ✅ **Absolute**: Precise placement

The scroll hint provides elegant, subtle guidance that helps users discover the carousel's interactivity without cluttering the interface, maintaining the page's sophisticated aesthetic.
