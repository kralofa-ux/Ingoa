

## Plan: Four UI Adjustments

### 1. Culture Selection Page — Vertical Centering
**File:** `src/pages/Onboarding.tsx` (lines 124-148)

The cultures step content currently starts at the top of the flex container. Add vertical centering by wrapping the content with `justify-center` spacing or adding top margin/padding to push the culture list toward the vertical center, matching how other steps like "mode" and "gender" naturally center due to less content.

- Add `mt-auto mb-auto` or `flex flex-col justify-center flex-1` to the cultures motion.div
- Reduce the heading bottom margin slightly if needed to keep the grid visually centered

### 2. Gender Selection — "Both" → "Surprise"
**Files:**
- `src/pages/Onboarding.tsx` line 167: Change `>Both<` to `>Surprise<`
- `src/pages/Settings.tsx` line 37 (genderOptions array): Change `label: "Both"` to `label: "Surprise"`

### 3. Name Preview Page — Match Onboarding Style
**File:** `src/pages/Onboarding.tsx` (lines 209-223)

The "names" step already uses the same motion wrapper and typography as other steps. The refresh involves:
- Ensuring the heading uses the same `text-3xl font-display font-extrabold uppercase` pattern (already does)
- Adding consistent spacing between subtitle and inputs to match other screens
- Ensuring input styling is uniform with the rest of the onboarding flow

Minimal changes needed — the structure already matches. Will verify padding/spacing consistency.

### 4. Settings — Name Preview Toggle with Smooth Expand
**File:** `src/pages/Settings.tsx` (lines 168-200)

Current behavior: toggle shows/hides fields with no animation. Update to:
- Replace the conditional render with a collapsible animated container using CSS `grid-rows` transition or framer-motion `AnimatePresence`
- Keep the toggle row as a clean single line: label + switch
- When toggled ON, smoothly expand to reveal First Name (read-only or display), Middle Name, and Last Name inputs
- Add `overflow-hidden` with `max-height` or `grid-template-rows` transition for smooth expand/collapse

**Implementation approach:** Use framer-motion's `animate` with `height: "auto"` since it's already imported in the project, wrapping the expandable section in `AnimatePresence` + `motion.div` with `initial/animate/exit` height transitions.

### Files to modify
1. `src/pages/Onboarding.tsx` — culture centering, gender label, name preview spacing
2. `src/pages/Settings.tsx` — gender label, name preview toggle animation

