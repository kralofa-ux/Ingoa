

# Fixes: Flag Scale, Swipe Direction, Share Button Size

## 1. Aotearoa Flag Scale (`src/components/CultureIcon.tsx`)
The `1.5` multiplier is still not enough. Increase to `size * 1.8` and ensure the rendered image uses `object-cover` or adjusts aspect ratio. The Tino Rangatiratanga flag is wider than tall, so it renders smaller at equal width/height. Fix by making the width larger than the height (e.g. `width: size * 2, height: size`).

## 2. Swipe Exit Direction (`src/components/SwipeCard.tsx`)
Currently the exit animation is hardcoded to `x: 300` (always exits right). Fix:
- Track the last swipe direction via a `useRef` or state (`"left" | "right"`)
- Set it in `handleDragEnd` before calling `onSwipeLeft`/`onSwipeRight`
- Use a custom exit variant: `x: direction === "left" ? -300 : 300`

## 3. Share Button Size (`src/components/NameDetail.tsx`)
The gender tag uses `px-5 py-2 text-xs`. The share button uses `px-5 py-2.5 text-sm`. Change the share button to match: `px-5 py-2 text-xs font-bold tracking-widest uppercase` — same classes as the gender pill.

## Files to Modify
- `src/components/CultureIcon.tsx` — widen Aotearoa flag render dimensions
- `src/components/SwipeCard.tsx` — track swipe direction, use it in exit animation
- `src/components/NameDetail.tsx` — match share button styling to gender pill

