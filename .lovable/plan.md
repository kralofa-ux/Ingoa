

# Mobile-Only Polish — Skipping Stripe Steps

Since the app is mobile-only (iOS/Android via Capacitor), Stripe web checkout won't apply — you'll use Apple IAP / Google Play billing later via RevenueCat or similar. Skipping all Stripe wiring steps.

## Remaining items to implement now

### 1. Safe Area Insets
**Why:** iPhone notch/Dynamic Island clips the bottom nav and top content.
- **BottomNav:** Add `pb-[env(safe-area-inset-bottom)]` padding inside the nav
- **Body CSS:** Remove the blanket `padding-top/bottom/left/right: env(safe-area-inset-*)` from body (causes double padding) — apply per-component instead
- **Page headers:** Add `pt-[env(safe-area-inset-top)]` to Browse, Liked, Matches, Settings top wrappers

### 2. Native Mobile CSS
**Why:** Web behaviors (text selection, overscroll bounce, long-press callout) feel non-native.
- Add to `index.css` body: `user-select: none`, `overscroll-behavior: none`, `-webkit-touch-callout: none`
- Keep `user-select: auto` on inputs/textareas

### 3. Skeleton Loading States
**Why:** Spinner looks web-like. Skeleton card placeholder feels native.
- Replace `<Loader2>` spinner in `SwipeDeck` with a skeleton card matching SwipeCard shape (rounded-3xl, same height)

### 4. Haptic Feedback
**Why:** Native swipe apps have tactile feedback.
- `@capacitor/haptics` is already installed
- Add `Haptics.impact()` on swipe like/pass and undo in SwipeCard/SwipeDeck
- Wrap in try/catch for web fallback

### 5. Sign in with Apple
**Why:** Required by Apple if any social login exists. Even with email-only, Apple recommends it.
- Add Apple sign-in button to Auth page
- Use `supabase.auth.signInWithOAuth({ provider: 'apple' })`
- Requires Apple Developer config from you (Services ID, private key)

---

## Files to edit
- `src/index.css` — remove body safe-area padding, add native CSS rules
- `src/components/BottomNav.tsx` — safe area bottom padding
- `src/pages/Browse.tsx` — safe area top
- `src/pages/LikedList.tsx` — safe area top
- `src/pages/Matches.tsx` — safe area top
- `src/pages/Settings.tsx` — safe area top
- `src/components/SwipeDeck.tsx` — skeleton loading + haptics
- `src/components/SwipeCard.tsx` — haptic on drag end
- `src/pages/Auth.tsx` — Apple sign-in button

## Effort: ~1.5 days

