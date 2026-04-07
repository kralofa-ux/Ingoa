

# Ingoa — Mobile-First Optimization & Store Readiness

## Current Score: ~68/100 → Target: 85+

The app has auth, Stripe payments, swipe engine, and cloud persistence. The remaining gaps fall into three categories: **mobile UX polish**, **missing integrations**, and **native packaging**.

---

## Implementation Plan (ordered by priority)

### 1. Stripe Webhook Edge Function
**Why:** After checkout, subscription status relies on polling. Webhooks give instant confirmation.
- Create `supabase/functions/stripe-webhook/index.ts`
- Handle `checkout.session.completed` and `customer.subscription.deleted`
- Verify Stripe signature using `STRIPE_WEBHOOK_SECRET` (will need to add this secret)
- Set `verify_jwt = false` in config for this function
- Update user's subscription status in profiles table

### 2. Wire Onboarding Plan Buttons to Stripe
**Why:** The "Choose Your Plan" step buttons are non-functional — they don't trigger checkout.
- Edit `src/pages/Onboarding.tsx` to call `create-checkout` when Monthly/Lifetime buttons are clicked
- Add loading state to buttons during redirect
- "Continue Free" keeps existing behavior

### 3. Safe Area Insets for BottomNav
**Why:** On iPhone notch/Dynamic Island devices, the bottom nav overlaps the home indicator.
- Edit `src/components/BottomNav.tsx` — add `pb-[env(safe-area-inset-bottom)]` padding
- Remove safe-area padding from `body` in `src/index.css` (it adds unnecessary top padding on all pages) and apply it per-component instead
- Add top safe area to page headers (Browse, Liked, Matches, Settings)

### 4. Disable Text Selection & Overscroll
**Why:** Native apps don't have rubber-band scrolling or text selection on UI elements.
- Add `-webkit-user-select: none` and `user-select: none` to body
- Add `overscroll-behavior: none` to prevent pull-to-refresh bounce
- Add `-webkit-touch-callout: none` to prevent long-press context menus
- Keep text selection enabled on input fields

### 5. Skeleton Loading States
**Why:** Spinner feels web-like. Skeleton cards feel native.
- Replace `<Loader2>` spinner in `SwipeDeck` with a skeleton card matching SwipeCard dimensions
- Add skeleton rows to LikedList and Matches loading states

### 6. Haptic Feedback on Swipe Actions
**Why:** Tactile feedback is expected in native swipe-based apps.
- Install `@capacitor/haptics`
- Add `Haptics.impact()` on swipe complete (like/pass), undo, and button taps
- Wrap in try/catch so it degrades gracefully on web

### 7. Checkout Opens In-App (not new tab)
**Why:** `window.open("_blank")` breaks on iOS Capacitor — it opens Safari outside the app.
- Change `window.open(url, "_blank")` to `window.location.href = url` in Subscription.tsx and Onboarding.tsx
- Stripe redirects back to the app's success URL

### 8. Sign in with Apple
**Why:** Required by Apple if any third-party login exists. Currently only email/password.
- Configure Apple auth in Lovable Cloud
- Add Apple sign-in button to `src/pages/Auth.tsx`
- Use `supabase.auth.signInWithOAuth({ provider: 'apple' })`

---

## Files to Create
- `supabase/functions/stripe-webhook/index.ts`

## Files to Edit
- `src/pages/Onboarding.tsx` — wire plan buttons + safe area
- `src/components/BottomNav.tsx` — safe area bottom padding
- `src/components/SwipeDeck.tsx` — skeleton loading + haptics
- `src/components/SwipeCard.tsx` — haptics on swipe
- `src/pages/Subscription.tsx` — fix `window.open` for in-app
- `src/pages/Auth.tsx` — Apple sign-in button
- `src/pages/Browse.tsx` — safe area top padding
- `src/pages/LikedList.tsx` — safe area top
- `src/pages/Matches.tsx` — safe area top
- `src/pages/Settings.tsx` — safe area top
- `src/index.css` — disable overscroll, text selection, move safe area from body to components
- `supabase/config.toml` — webhook function config

## Estimated Effort
~3-4 days for all 8 items. Items 1-7 can be done in Lovable. Item 8 requires Apple Developer configuration from you.

