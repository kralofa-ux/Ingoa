

# UI Adjustments — Menu Alignment, Flag Fix, Rename to Aotearoa

## 1. Rename "NZ Māori" → "Aotearoa"

The `Culture` type in `src/data/names.ts` is used as the internal key everywhere. Changing it means updating:

- `src/data/names.ts` — type union: replace `"NZ Māori"` with `"Aotearoa"`
- `src/components/CultureIcon.tsx` — svgMap key
- `src/lib/cultureColors.ts` — type, color record key, emoji record key, fallback
- `src/components/FilterBar.tsx` — culture list label
- `src/pages/Settings.tsx` — culture list label
- `src/pages/Onboarding.tsx` — CULTURES array
- `src/pages/Admin.tsx` — CULTURES array and default form values

**Database note**: If the `names` table stores `"NZ Māori"` as culture values, a migration will be needed: `UPDATE names SET culture = 'Aotearoa' WHERE culture = 'NZ Māori';`

## 2. Tino Rangatiratanga Flag — Transparent Background & Scale

- In `CultureIcon.tsx`, add `rounded-sm` class and slightly increase the SVG render size for NZ Māori/Aotearoa (e.g. `size * 1.2`) to visually match emoji flags
- If the SVG file itself has a white background rect, remove it from `src/assets/tino.svg`

## 3. Settings Page — Use CultureIcon, Remove Color Dots

- Replace `cultureEmoji[c.value]` with `<CultureIcon culture={c.value} size={18} />`
- Remove the `<span className="w-2.5 h-2.5 rounded-full ${color.dot}" />` dot element
- Remove unused `getCultureColor` and `cultureEmoji` imports

## 4. Filter Bar — Menu Alignment

- Wrap both the culture dropdown button and gender pills in a unified flex container
- Make the culture dropdown button match the gender toggle height/padding (`p-1` outer, `px-4 py-2` inner)
- Both elements already use `glass rounded-full border border-border` — ensure consistent sizing

## Files to Modify
- `src/data/names.ts`
- `src/components/CultureIcon.tsx`
- `src/lib/cultureColors.ts`
- `src/components/FilterBar.tsx`
- `src/pages/Settings.tsx`
- `src/pages/Onboarding.tsx`
- `src/pages/Admin.tsx`
- `src/assets/tino.svg` (if white bg rect exists)
- Database migration: rename culture value

