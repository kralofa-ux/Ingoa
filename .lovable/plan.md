

# UI Updates — Copy, Gender Colors, Labels, Layout, and Cleanup

## Changes

### 1. Welcome Screen Copy (`src/pages/Onboarding.tsx`)
- Change "Kia Ora!" → "Kia orana,"
- Change subtitle to: "A simple, tool to help families choose and preserve Pacific names for the next generation"

### 2. Card Colors by Gender instead of Culture (`src/components/SwipeCard.tsx`, `src/components/NameDetail.tsx`, `src/pages/Matches.tsx`)
- Replace `getCultureColor(name.culture)` with a gender-based color map:
  - Male → ocean blue (`hsl(200, 80%, 50%)`)
  - Female → coral/pink (`hsl(340, 70%, 55%)`)
  - Unisex → warm violet (`hsl(270, 60%, 55%)`)
- Culture remains as text label on cards, just no longer drives the background color
- Update `LikedList.tsx` accent bar to use gender color too

### 3. Gender Labels — "Male" / "Female" / "Unisex" everywhere
- `SwipeCard.tsx`: Change `genderLabel` map from Tāne/Wahine to Male/Female/Unisex
- `NameDetail.tsx`: Same change
- `FilterBar.tsx`: Change gender pill labels from Tāne/Wahine to Male/Female
- `Settings.tsx`: Already uses Male/Female/Both — reorder to Male, Female, Both
- `Onboarding.tsx`: Already uses "Male names" / "Female names" — no change needed

### 4. Gender Filter Toggle (`src/components/FilterBar.tsx`)
- Change labels: "All" → remove, "Tāne" → "Male", "Wahine" → "Female"
- Show Male and Female as toggle pills; when both selected → show both genders

### 5. Card Detail Order (`src/components/SwipeCard.tsx`, `src/components/NameDetail.tsx`)
- New order: Culture badge → Name → Meaning → Gender pill
- Move gender pill below meaning (currently above it)

### 6. Remove Card Counter (`src/components/SwipeDeck.tsx`)
- Delete the counter `<span>` showing "X / Y" on top left

### 7. Move Undo Button onto Card (`src/components/SwipeDeck.tsx`, `src/components/SwipeCard.tsx`)
- Remove undo button from SwipeDeck's top bar
- Pass `onUndo` and `canUndo` props to SwipeCard
- Position undo button in top-right corner of the card itself
- Increase card height from `h-[520px]` to `h-[560px]`

### 8. Liked List — Remove Grip Dots (`src/pages/LikedList.tsx`)
- Remove the `<GripVertical>` icon from list items
- Keep drag-and-drop Reorder functionality intact

### 9. Remove Admin Dashboard from UI (`src/pages/Settings.tsx`, `src/App.tsx`)
- Remove the admin link button from Settings
- Remove the `/admin` route from App.tsx routes
- Remove admin import; keep the Admin page file for backend-only access
- Remove `/admin` from `hideNav` array

### 10. Settings Gender Order (`src/pages/Settings.tsx`)
- Reorder to: Male, Female, Both

### 11. Tino Rangatiratanga Flag (`src/lib/cultureColors.ts`, all files using `cultureEmoji`)
- Replace NZ Māori emoji from 🇳🇿 to the Tino Rangatiratanga flag
- Since there's no standard emoji for this flag, use a text representation or a custom element. Most practical: use a small inline SVG or the closest available symbol. Will use "🖤❤️🤍" as a compact stand-in, or a single custom span with the flag colors.
- Simplest approach: replace with a Unicode placeholder like "◆" styled in the culture color, or keep the existing approach but note limitation. Will use a simple "🔴⚫⚪" triplet or just change to a decorative element.

### 12. Culture List Order — Cook Islands & Samoa first
Update the culture arrays in:
- `FilterBar.tsx`
- `Settings.tsx`
- `Onboarding.tsx`

New order: Cook Islands, Samoa, NZ Māori, Tonga, Fiji, Hawaii, Niue, Tahiti

### Files to modify
- `src/components/SwipeCard.tsx`
- `src/components/SwipeDeck.tsx`
- `src/components/FilterBar.tsx`
- `src/components/NameDetail.tsx`
- `src/pages/LikedList.tsx`
- `src/pages/Matches.tsx`
- `src/pages/Settings.tsx`
- `src/pages/Onboarding.tsx`
- `src/App.tsx`
- `src/lib/cultureColors.ts`

### No new dependencies needed.

