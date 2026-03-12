

# UI & Feature Updates — Flags, Colors, Layout, Swipe Overlays

## 1. Copy Flag SVGs into Project Assets
- Copy `user-uploads://tino.svg` → `src/assets/tino.svg`
- Copy `user-uploads://hawaii_flag.svg` → `src/assets/hawaii_flag.svg`

## 2. Replace Culture Emoji with Flag Components (`src/lib/cultureColors.ts`)
- Change `cultureEmoji` from a `Record<string, string>` to a React component approach
- Create a new `CultureIcon` component (`src/components/CultureIcon.tsx`) that renders:
  - NZ Māori → inline `<img>` of `tino.svg` (sized ~20px)
  - Hawaii → inline `<img>` of `hawaii_flag.svg` (sized ~20px)
  - All others → emoji flag as before (🇨🇰, 🇼🇸, etc.)
- Update all consumers: `SwipeCard`, `FilterBar`, `Onboarding`, `NameDetail`, `LikedList`, `Matches`

## 3. Remove Color Dots from Culture Menus (`src/components/FilterBar.tsx`)
- Delete the `<span className="w-2.5 h-2.5 rounded-full ...">` dot element from culture dropdown items
- Culture items show: icon/flag + text label only

## 4. Auto-Enable Name Preview on Onboarding (`src/pages/Onboarding.tsx`)
- In `handleFinish`, check if `middleName` or `lastName` is non-empty
- If so, include `show_name_preview: true` in the `updateProfile` call
- In `AppContext.tsx`, sync `showNamePreview` from `profile.show_name_preview` (if the field exists in the profile)

## 5. Unisex Card Color → Orange (`src/lib/genderColors.ts`)
- Change unisex from `hsl(270,60%,55%)` (violet) to `hsl(30,85%,55%)` (warm orange)
- This complements ocean blue (male) and coral pink (female)

## 6. Culture Tab Single-Line on Mobile (`src/components/FilterBar.tsx`)
- Add `whitespace-nowrap` to the culture dropdown button to prevent wrapping
- Reduce padding slightly if needed: `px-4 py-2`

## 7. Swipe Feedback Overlays for First 3 Swipes (`src/components/SwipeCard.tsx`)
- Add `swipeCount` prop to SwipeCard (passed from SwipeDeck)
- Add `useTransform` for `likeOpacity` and `passOpacity` based on drag x position
- When `swipeCount < 3`, render two overlay `motion.div`s:
  - Left drag → "PASS" text overlay (white text, semi-transparent dark bg)
  - Right drag → "LIKE" text overlay
- After 3 swipes, overlays no longer render
- Pass `swipeCount` from `SwipeDeck` to `SwipeCard`

## Files to Modify
- `src/assets/tino.svg` (copy)
- `src/assets/hawaii_flag.svg` (copy)
- `src/components/CultureIcon.tsx` (new)
- `src/lib/cultureColors.ts` — keep emoji map but add note about CultureIcon
- `src/lib/genderColors.ts` — unisex color change
- `src/components/SwipeCard.tsx` — swipe overlays + CultureIcon
- `src/components/SwipeDeck.tsx` — pass swipeCount to SwipeCard
- `src/components/FilterBar.tsx` — remove dots, whitespace-nowrap
- `src/pages/Onboarding.tsx` — auto-enable name preview
- `src/context/AppContext.tsx` — sync showNamePreview from profile
- `src/components/NameDetail.tsx` — use CultureIcon
- `src/pages/LikedList.tsx` — use CultureIcon
- `src/pages/Matches.tsx` — use CultureIcon

## No new dependencies needed.

