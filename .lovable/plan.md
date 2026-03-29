

## Plan: Inline SVG Icons to Eliminate Load Delay

### Problem
All icons are loaded via `<img src={...}>` which triggers separate network requests, causing a visible flash/delay as icons pop in after the page renders.

### Solution
Convert SVG assets into inline React components so they're bundled in the JS and render instantly. For the PNG logo, add Vite's `svgr` plugin or keep as `<img>` with eager loading.

### Approach

**1. Create `src/components/icons/` with inline SVG components**

Convert each SVG file into a React component that returns the SVG markup directly:
- `NavHomeIcon.tsx` — from `nav-home.svg`
- `NavLikedIcon.tsx` — from `nav-liked.svg`
- `NavMatchesIcon.tsx` — from `nav-matches.svg`
- `NavSettingsIcon.tsx` — from `nav-settings.svg`
- `UndoSwipeIcon.tsx` — from `undo-swipe.svg`
- `NavPassIcon.tsx` — from `nav-pass.svg`
- `NavSwipeRightIcon.tsx` — from `nav-swipe-right.svg`

Each component accepts `className` prop and passes it to the root `<svg>` element, using `currentColor` for fill so CSS color/filter classes work.

**2. Update all consumers to use inline components instead of `<img>`**

Files to update:
- `src/components/BottomNav.tsx` — replace 4 `<img>` tags with inline icon components
- `src/pages/LikedList.tsx` — replace `<img src={navLiked}>` with `<NavLikedIcon>`
- `src/pages/Matches.tsx` — replace `<img src={navMatches}>` with `<NavMatchesIcon>`
- `src/components/SwipeCard.tsx` — replace undo `<img>` with `<UndoSwipeIcon>`
- `src/components/SwipeTutorial.tsx` — replace undo `<img>` with `<UndoSwipeIcon>`
- `src/pages/Onboarding.tsx` — replace swipe-right, pass, undo `<img>` tags with components

**3. Logo PNG handling**

The `logo.png` cannot be inlined as SVG. Instead, add `loading="eager"` and `fetchPriority="high"` to all `<img src={logo}>` tags in:
- `src/components/PageTitle.tsx`
- `src/pages/Index.tsx`
- `src/pages/Auth.tsx`
- `src/pages/ResetPassword.tsx`
- `src/pages/Onboarding.tsx`

### Technical details

Each icon component pattern:
```tsx
const NavLikedIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 142.78 131.83" className={className} fill="currentColor">
    <polygon points="142.78 47.87 102.08 0 ..."/>
  </svg>
);
```

Using `fill="currentColor"` means we can style color with Tailwind `text-white` instead of CSS filter hacks like `invert brightness-200`.

### Files to create (7)
- `src/components/icons/NavHomeIcon.tsx`
- `src/components/icons/NavLikedIcon.tsx`
- `src/components/icons/NavMatchesIcon.tsx`
- `src/components/icons/NavSettingsIcon.tsx`
- `src/components/icons/UndoSwipeIcon.tsx`
- `src/components/icons/NavPassIcon.tsx`
- `src/components/icons/NavSwipeRightIcon.tsx`

### Files to modify (8)
- `src/components/BottomNav.tsx`
- `src/pages/LikedList.tsx`
- `src/pages/Matches.tsx`
- `src/components/SwipeCard.tsx`
- `src/components/SwipeTutorial.tsx`
- `src/pages/Onboarding.tsx`
- `src/components/PageTitle.tsx`
- `src/pages/Index.tsx`, `Auth.tsx`, `ResetPassword.tsx` (logo eager loading)

