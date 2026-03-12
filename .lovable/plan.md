

# UI Adjustments — Flag Scale, Nav Icons, Remove Filters, Share Relocation

## 1. Aotearoa Flag Scale (`src/components/CultureIcon.tsx`)
- Increase the Aotearoa multiplier from `size * 1.2` to `size * 1.5` so the Tino Rangatiratanga flag visually matches emoji flag sizes

## 2. Bottom Nav — Icons Only (`src/components/BottomNav.tsx`)
- Remove the `<span>` text labels ("Swipe", "Liked", "Matches", "Settings")
- Remove `gap-1` from the link flex container since there's no text
- Keep icons, active indicator dot, and badge count

## 3. Remove Filters from Browse Screen (`src/pages/Browse.tsx`)
- Remove the `FilterBar` import and `<FilterBar />` from the browse page
- Reduce header padding since filters are gone; keep just the "Ingoa" title
- The swipe area expands to fill the freed space naturally via `flex-1`

## 4. Move Share to Name Detail View
- **`src/pages/LikedList.tsx`**: Remove the Share2 button from list items; remove `shareName` function and `Share2` import
- **`src/components/NameDetail.tsx`**: Add a Share button (Share2 icon) at the bottom of the detail card. Implement share logic (navigator.share / clipboard fallback) using name, meaning, and culture

## Files to Modify
- `src/components/CultureIcon.tsx`
- `src/components/BottomNav.tsx`
- `src/pages/Browse.tsx`
- `src/pages/LikedList.tsx`
- `src/components/NameDetail.tsx`

