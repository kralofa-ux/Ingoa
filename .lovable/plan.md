

# Phase 5: Full Design Redesign — Bold, Modern, Fun

Inspired by the reference images: dark backgrounds, vibrant culture-specific colors, large playful typography, high contrast, rounded shapes, and strong visual hierarchy.

## Core Design System Changes

### 1. `src/index.css` — New color system + typography
- **Dark-first palette**: Deep charcoal/navy background (`hsl(220, 20%, 8%)`), not sand
- **Culture color map** as CSS variables — each culture gets a bold, saturated color:
  - NZ Maori: teal `#14b8a6`, Cook Islands: blue `#3b82f6`, Samoa: coral `#f97316`, Tonga: crimson `#ef4444`, Fiji: emerald `#10b981`, Hawaii: amber `#f59e0b`, Niue: violet `#8b5cf6`, Tahiti: pink `#ec4899`
- **Swap fonts**: Replace DM Serif Display with a bolder display font — use `DM Sans` at heavy weights (800-900) for display to keep things cohesive and modern (no serif). Or import a bolder Google font like `Space Grotesk` or `Plus Jakarta Sans` for display.
- Larger base sizes, more whitespace, stronger shadows with colored glows
- Light mode becomes the bold dark theme; keep a secondary light option

### 2. `src/components/SwipeCard.tsx` — Hero-level card
- Card background fills with the culture's color (full bleed, not just a stripe)
- White text on colored background for maximum contrast
- Name at `7xl`/`8xl`, extremely bold
- Gender pill in white/translucent overlay
- Meaning text in white, larger, non-italic, confident
- Culture label as a small rounded badge at top
- LIKE/PASS overlays: larger, bolder, with glow effects
- Rounded corners stay at `3xl`

### 3. `src/components/SwipeDeck.tsx` — Layout tweaks
- Remove the counter text or make it a subtle pill
- Undo button gets a glassmorphic style
- End-of-deck screen uses culture gradient background

### 4. `src/pages/Browse.tsx` — Header refresh
- "Ingoa" title larger and bolder, or replaced with a fun icon/wordmark
- FilterBar integrated more tightly

### 5. `src/components/FilterBar.tsx` — Bold pills
- Larger pills with more padding (`px-5 py-2.5`)
- Active state uses vibrant fill with white text
- Culture dropdown gets colored dots next to each culture name
- Glassmorphic dropdown panel

### 6. `src/components/BottomNav.tsx` — Modern tab bar
- Glassmorphic dark background with blur
- Active tab gets a colored dot indicator below icon
- Slightly larger icons (`w-6 h-6`)
- Remove text labels — icon-only for cleaner look (or keep very small)

### 7. `src/pages/LikedList.tsx` — Colorful list
- Each row gets a left-side color accent bar matching culture color
- Darker card backgrounds with colored borders
- Name in bold, larger font
- Star/share/delete icons with culture-colored hover states

### 8. `src/pages/Matches.tsx` — Vibrant match cards
- Each match card uses its culture color as background (like SwipeCard)
- White text, rounded, with a heart icon
- Staggered entrance animation

### 9. `src/pages/Onboarding.tsx` — Bold onboarding
- Dark background throughout
- Culture selection cards use their culture colors when selected (filled background)
- Mode cards get vibrant borders and fills
- Progress dots use accent colors
- Larger headings, bolder CTAs

### 10. `src/pages/Auth.tsx` — Dark auth screen
- Dark background with a subtle gradient
- Input fields with dark backgrounds and bright borders on focus
- CTA button uses a vibrant gradient (coral to orange or culture-themed)

### 11. `src/components/NameDetail.tsx` — Culture-colored modal
- Modal background matches culture color
- White text, bold name, clean layout

### 12. `src/pages/Settings.tsx` — Dark settings
- Dark cards with subtle borders
- Culture list items show their color dot
- Toggle switches use vibrant accent colors

## Shared Culture Color Utility
Create a small helper (`src/lib/cultureColors.ts`) exporting a map of culture -> { bg, text, border, gradient } Tailwind classes so all components stay consistent.

## Files to create
- `src/lib/cultureColors.ts`

## Files to modify
- `src/index.css`
- `src/components/SwipeCard.tsx`
- `src/components/SwipeDeck.tsx`
- `src/components/FilterBar.tsx`
- `src/components/BottomNav.tsx`
- `src/components/NameDetail.tsx`
- `src/pages/Browse.tsx`
- `src/pages/LikedList.tsx`
- `src/pages/Matches.tsx`
- `src/pages/Onboarding.tsx`
- `src/pages/Auth.tsx`
- `src/pages/Settings.tsx`

## No new dependencies needed
All achievable with existing Tailwind + framer-motion + Google Fonts.

