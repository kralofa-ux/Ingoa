

## Plan: Three UI Updates

### 1. Tino Rangatiratanga Flag for Aotearoa
**File:** `src/components/CultureIcon.tsx`

- Move "Aotearoa" from `emojiMap` (currently 🇳🇿) to `svgMap`, using the already-imported `tinoFlag` asset
- This automatically renders it as a crisp SVG `<img>` with `rounded-sm` and consistent sizing, matching Hawaii's treatment

### 2. Gender Label: "Surprise" → "Both" in Settings & FilterBar Only
**Files:**
- `src/pages/Settings.tsx` line 33: Change `label: "Surprise"` → `label: "Both"`
- `src/components/FilterBar.tsx` line 22: The "all" option already says `"All"` — confirm no change needed there (it's the swipe filter)

Onboarding remains unchanged (keeps "Surprise").

### 3. Name Preview Inputs — Pill-Shaped with Graduated Blue Fills
**File:** `src/pages/Onboarding.tsx` lines 217-222

Replace the `frosted-pill` class on inputs with solid light-blue background shades:
- Middle Name: `bg-[hsl(210,70%,75%)]` (lighter blue)
- Last Name: `bg-[hsl(210,60%,68%)]` (slightly deeper blue)

Each input keeps `rounded-full`, `border-0`, white/light text, no outline borders — soft, tactile pill appearance.

### Files to modify
1. `src/components/CultureIcon.tsx` — move Aotearoa to SVG map
2. `src/pages/Settings.tsx` — "Surprise" → "Both"
3. `src/pages/Onboarding.tsx` — solid blue pill inputs

