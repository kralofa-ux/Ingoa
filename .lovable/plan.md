

# Design Refresh — Brighter Ocean + Remove LIKE/PASS Overlays

Two changes in one pass:

## 1. Remove LIKE/PASS overlays from SwipeCard
Delete the two `motion.div` overlay elements (lines 52-63) and the now-unused `likeOpacity`/`passOpacity` transforms (line 23-24).

## 2. Brighten the palette — ocean blue focus

Update `src/index.css` `:root` variables:

```text
Background:       210 40% 96%    (light blue-grey, was 220 20% 8%)
Foreground:        220 30% 15%    (dark navy)
Card:              210 30% 100%   (white)
Card-foreground:   220 30% 15%
Secondary:         210 35% 92%
Muted:             210 25% 88%
Muted-foreground:  210 15% 45%
Primary:           200 80% 50%    (ocean blue, was teal)
Primary-foreground: 0 0% 100%
Border:            210 25% 85%
Input:             210 25% 90%
Ring:              200 80% 50%
```

Update utility classes:
- `.glass` → `hsl(210 30% 98% / 0.8)` with blur
- Shadows → blue-tinted: `hsl(210 40% 70% / 0.25)`
- Gradients → ocean blue variants

Keep `.dark` block for future dark mode toggle but shift `:root` to bright.

## Files to modify
- `src/index.css` — new bright ocean color system
- `src/components/SwipeCard.tsx` — remove LIKE/PASS overlays + unused transforms

