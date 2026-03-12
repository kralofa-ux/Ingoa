

# Redesign: Deep Ocean Theme

## Concept
Shift the entire app from a light blue-grey palette to a **deep navy/ocean** base. The onboarding becomes immersive — dark gradients that feel like looking into the Pacific at night. The rest of the app follows with the same deep tones so everything feels connected.

## 1. Global Color Palette (`src/index.css`)

Replace the light `:root` theme with a deep ocean palette:

- **Background**: `220 40% 7%` (near-black navy)
- **Foreground**: `210 20% 92%` (warm off-white for legibility)
- **Card**: `220 35% 11%` (slightly lifted dark panel)
- **Primary**: `195 85% 45%` (bright cyan-blue, pops on dark)
- **Muted**: `220 20% 18%` / muted-foreground `210 15% 55%`
- **Border**: `220 20% 16%` (subtle, not harsh)
- **Input**: `220 20% 14%`
- **Accent**: keep coral `12 80% 58%` — warm contrast

Update gradients:
- `--gradient-primary`: deep blue to teal (`hsl(210 60% 18%)` to `hsl(195 85% 45%)`)
- Add `--gradient-deep`: `hsl(220 50% 5%)` to `hsl(210 40% 14%)` for backgrounds

Update shadows to use darker, more subtle glows with cyan tints.

Update `.glass` to dark glass: `hsl(220 35% 10% / 0.85)` with backdrop blur.

Remove `.dark` theme block (the default IS dark now).

## 2. Onboarding Redesign (`src/pages/Onboarding.tsx`)

**Step 0 (Welcome):**
- Remove the app icon box (the `w-20 h-20 rounded-2xl gradient-primary` div with 🌊)
- Keep "Kia orana," heading — make it white/bright
- Subtitle text in a soft blue-grey (`text-muted-foreground`)
- Background: full-screen deep gradient with subtle animated blur orbs in deep blue/teal tones

**Steps 1-4:**
- Selection cards: dark glass panels (`bg-white/5 border-white/10`) with bright border on select (`border-primary`)
- Culture buttons: same dark glass base, selected state uses culture color at low opacity + bright border
- Gender buttons: dark glass, selected gets cyan glow
- Inputs: dark background (`bg-white/5`), light placeholder, bright focus ring

**Progress dots:** Bright cyan active dot on dark, unvisited dots as `bg-white/10`

**Continue button:** Bright gradient (teal to cyan) on dark — stands out clearly

**Background container:** Replace light blur orbs with deep-toned orbs (`bg-primary/10`, `bg-cyan-500/5`)

## 3. Bottom Nav (`src/components/BottomNav.tsx`)
- `.glass` class now resolves to dark glass automatically via CSS change
- No code change needed — just the CSS update handles it

## 4. Browse Page (`src/pages/Browse.tsx`)
- No changes needed — inherits dark `bg-background` and `text-foreground`

## Files to Modify
- `src/index.css` — full palette swap to deep ocean, update glass utility
- `src/pages/Onboarding.tsx` — remove app icon, restyle cards/buttons to dark glass

