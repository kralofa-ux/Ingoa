

# What's Next — App Store Readiness Checklist

All 5 mobile polish items from the previous plan are **done**. Here's what remains before you can submit to the App Store and Google Play.

---

## Things I Can Do Now (in Lovable)

### 1. Network Error Handling
Add offline detection and error boundaries so the app doesn't silently fail when there's no connection. Show a toast or banner when network requests fail.
- Files: `src/App.tsx`, `src/hooks/useNames.ts`, `src/context/AppContext.tsx`

### 2. Server-Side Swipe Limit
The daily swipe counter is currently in `localStorage` — users can clear it to bypass limits. Move it to the database with an RPC or edge function.
- Files: `src/components/SwipeDeck.tsx`, new migration, possibly new edge function

### 3. Remove Body Safe-Area Top/Bottom Padding
The plan called for removing blanket `padding-top/bottom` from body CSS to avoid double-padding, but `padding-left` and `padding-right` were kept. Currently body still has left/right which is fine, but verify no pages have double top padding.

### 4. Page Transitions Consistency
Wrap all pages in `PageTransition` for consistent enter/exit animations, including Onboarding.

---

## Things That Need Your Action (Outside Lovable)

### 5. Apple Developer Setup for Sign in with Apple
The button is wired in code, but you need to:
- Create a Services ID in Apple Developer Console
- Generate a private key (.p8) for Sign in with Apple
- Configure the redirect URL in Apple Developer Console
- Add credentials in Lovable Cloud auth settings

### 6. App Icon & Splash Screen
Apple requires a 1024x1024 app icon. You need to design this and add it to the Capacitor iOS/Android projects via Xcode and Android Studio.

### 7. In-App Purchases (RevenueCat)
Since you're skipping Stripe for mobile, you'll need RevenueCat or StoreKit/Google Play Billing for the $9.99/mo and $20 lifetime products. This is native SDK work done outside Lovable.

### 8. Privacy Policy & Terms URLs
Apple requires working privacy policy and terms URLs. You have `/privacy` and `/terms` pages — make sure they're hosted at public URLs you can provide during App Store review.

### 9. App Store Screenshots & Metadata
Prepare 6.7" and 5.5" screenshots, app description, keywords, and category for App Store Connect.

---

## Recommended Next Step

**Option A**: I implement items 1-2 (network error handling + server-side swipe limit) — the two remaining code gaps.

**Option B**: You set up Apple Developer credentials for Sign in with Apple, and I help configure it in Lovable Cloud.

Which would you like to tackle?

