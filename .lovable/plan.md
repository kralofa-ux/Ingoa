

## Plan: Replace Aotearoa Flag SVG

**What**: Copy the uploaded `TINO_1.svg` to `src/assets/tino.svg`, replacing the current file. Then update `CultureIcon.tsx` to render it as a square (1:1 ratio) since the new SVG is 480×480.

**Changes**:

1. **Copy uploaded file** → `src/assets/tino.svg` (overwrite existing)

2. **Update `src/components/CultureIcon.tsx`**:
   - Remove the special `isAotearoa` width doubling logic (lines 27-29)
   - Render Aotearoa at `size × size` like all other SVG flags since the new SVG is square

