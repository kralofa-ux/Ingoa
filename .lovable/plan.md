

# Redesign: Match Reference Screenshot Style

## Analysis of Reference

The reference shows a **vibrant, saturated royal blue** background (not dark navy), with **frosted light pill-shaped elements**, **large bold uppercase typography**, and a **graphic/poster-like** aesthetic. Key differences from current:

- Background is a bright saturated blue (~`hsl(235, 70%, 45%)`), not near-black
- UI elements are **light frosted pills** (white/light blue at ~20-30% opacity) with **dark text on light pills**
- Typography is extremely bold, uppercase, large — left-aligned headings
- Buttons are `rounded-full` pills, not `rounded-xl` cards
- Continue button is **dark navy** pill, not gradient
- Progress dots are dark navy circles
- Gender options use color-coded pills: blue for Boy, pink for Girl, orange/gold for Surprise
- No visible borders — elements use solid/frosted fills
- Minimal, graphic, bold — no subtle glows or complex shadows

## Changes

### 1. `src/index.css` — Shift palette to vibrant blue
- `--background`: `235 65% 42%` (vibrant royal blue)
- `--foreground`: `0 0% 100%` (white)
- `--card`: `235 55% 35%` (slightly darker blue for cards)
- `--primary`: `235 50% 18%` (dark navy for buttons — the "Continue" button color)
- `--primary-foreground`: `0 0% 100%` (white text on dark buttons)
- `--secondary`: `210 40% 78%` (frosted light blue for pills)
- `--secondary-foreground`: `235 50% 20%` (dark text on light pills)
- `--muted`: `235 40% 50%`
- `--muted-foreground`: `220 30% 85%` (light subdued text)
- `--border`: `235 40% 50%` (subtle, same-tone)
- `--input`: `0 0% 100% / 0.15` (frosted input bg)
- Update `.glass` to white at 15% opacity
- Remove complex gradient/glow shadows — use simpler, subtler shadows
- Keep accent coral and gender colors

### 2. `src/pages/Onboarding.tsx` — Match reference layout
- **Step 0**: Large left-aligned uppercase text "KO TOKU INGOA" style heading. Remove subtitle description, keep it minimal.
- **Step 1 (Mode)**: Large uppercase heading "HOW DO YOU WANT TO USE INGOA?" — left-aligned. Solo/Couple as frosted `rounded-full` pills side by side.
- **Step 2 (Cultures)**: "SELECT CULTURES" heading. Single-column full-width frosted pills for each culture, text centered. Selected state uses slightly different tint.
- **Step 3 (Gender)**: "KNOW THE GENDER?" heading. Three pills: Boy (teal/cyan), Girl (pink), Surprise (orange). Color-coded.
- **Step 4 (Names)**: "NAME PREVIEW" heading. Frosted pill inputs for middle name and surname. Optional label.
- **Continue button**: Dark navy `rounded-full` pill, uppercase "CONTINUE"
- **Progress dots**: Dark navy circles at bottom, active dot slightly larger or filled differently
- **Background**: Solid vibrant blue, remove blur orbs

### 3. `src/pages/Auth.tsx` — Match the blue bg + frosted inputs
- Same vibrant blue background
- Frosted pill inputs
- Dark navy submit button

### 4. `src/pages/Browse.tsx` — Blue background
- Inherits from CSS changes

### 5. `src/components/BottomNav.tsx` — Dark navy glass bar
- Update to match: dark navy background, white icons

### 6. `src/pages/Settings.tsx` — Frosted cards on blue
- Cards become frosted white panels
- Buttons become frosted pills

### 7. `src/pages/LikedList.tsx`, `src/pages/Matches.tsx`
- Inherit new palette, cards adapt to frosted style

### 8. `src/components/SwipeCard.tsx`
- Keep gender-colored cards (already matches reference)
- Ensure text remains white and legible

### 9. `src/components/FilterBar.tsx`
- Frosted pills on blue background

## Files to Modify
- `src/index.css` — full palette shift to vibrant blue + frosted elements
- `src/pages/Onboarding.tsx` — complete restyle: large uppercase headings, frosted pills, dark navy buttons
- `src/pages/Auth.tsx` — match blue bg + frosted style
- `src/components/BottomNav.tsx` — dark navy bar
- `src/pages/Settings.tsx` — frosted card panels
- `src/pages/LikedList.tsx` — frosted list items
- `src/pages/Matches.tsx` — frosted match cards
- `src/components/FilterBar.tsx` — frosted pill dropdowns

