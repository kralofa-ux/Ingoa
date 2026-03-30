

# Ingoa — iOS App Store Launch Readiness Audit

---

## LAUNCH READINESS SCORE: 52 / 100

The app has strong design foundations, a working swipe engine, auth, partner connection, and cloud persistence. However, several critical gaps remain around payments, legal compliance, native packaging, and production hardening.

---

## CRITICAL BEFORE LAUNCH

### 1. No Payment Integration (Subscription is fake)
**What:** The "Upgrade to Premium" button does nothing. No Stripe, RevenueCat, or Apple IAP integration exists. The `subscription_status` field on profiles is never updated.
**Why:** App Store will reject if you advertise premium features without functional payment. Also a poor user experience.
**Solution:** Integrate RevenueCat (recommended for iOS IAP) or Stripe. Wire the subscription status to gate features (unlimited swipes, couple mode, etc.).
**Effort:** Large (3-5 days)

### 2. No Swipe Limit Enforcement
**What:** Free users should get 20 swipes/day per the plan cards, but `swipeCount` in `SwipeDeck.tsx` is stored in localStorage with no daily reset and no enforcement — it's only used for tutorial visibility.
**Why:** The business model relies on this gate. App Store reviewers will test it.
**Solution:** Track daily swipe count server-side (or with a date-stamped localStorage). Show a paywall when limit is hit.
**Effort:** Medium (1-2 days)

### 3. No Privacy Policy or Terms of Service Pages
**What:** No `/privacy` or `/terms` routes exist.
**Why:** Apple requires a Privacy Policy URL during App Store submission. Also required by GDPR/CCPA if serving those regions.
**Solution:** Create static pages with proper legal text. Link from Settings and onboarding.
**Effort:** Small (0.5 day)

### 4. No Capacitor / Native Wrapper Setup
**What:** No `capacitor.config.ts`, no iOS/Android projects.
**Why:** Cannot submit to App Store without a native wrapper.
**Solution:** Install Capacitor, configure for iOS, set up Xcode project. See Capacitor instructions in the knowledge base.
**Effort:** Medium (1-2 days)

### 5. Email Verification Not Enforced
**What:** `signUp` shows "Check your email to verify" toast but the app doesn't check if the email is verified before allowing login. Auto-confirm status is unknown.
**Why:** Fake/spam accounts. App Store reviewers expect proper auth flows.
**Solution:** Confirm auto-confirm is disabled. After signup, show a "verify your email" screen. Block login for unverified emails with a clear message.
**Effort:** Small (0.5 day)

### 6. Feedback Goes Nowhere
**What:** `handleSendFeedback` in Settings just shows a toast — feedback is not stored or emailed.
**Why:** Users expect their feedback to actually be received.
**Solution:** Store feedback in a `feedback` table in the database, or send via an edge function to email.
**Effort:** Small (0.5 day)

### 7. Delete Account — Missing Partner Cleanup
**What:** `delete-account` edge function deletes `liked_names`, `passed_names`, `profiles` but does NOT clean up `partner_connections` or `partner_codes`.
**Why:** Orphaned partner connections. Partner will still show "connected" to a deleted account.
**Solution:** Add cleanup for `partner_connections` and `partner_codes` in the delete function. Also disconnect the partner (set their mode back to solo).
**Effort:** Small (0.5 day)

---

## IMPORTANT BEFORE LAUNCH

### 8. No Haptic Feedback
**What:** Swipe gestures, button taps, and undo have no haptic response.
**Why:** Native iOS apps use haptics extensively. Without them, the app feels like a web page.
**Solution:** Use Capacitor Haptics plugin (`@capacitor/haptics`) for swipe completion, undo, like/pass, and button taps.
**Effort:** Small (0.5 day)

### 9. No Safe Area Handling
**What:** No `viewport-fit=cover` meta tag or `env(safe-area-inset-*)` padding for iPhone notch/Dynamic Island.
**Why:** Content will be hidden behind the notch/home indicator.
**Solution:** Add viewport-fit=cover to index.html and use safe-area padding on top/bottom elements.
**Effort:** Small (0.5 day)

### 10. Gender Label Inconsistency
**What:** Onboarding gender step shows "Surprise" (line 175) but Settings shows "Both" (line 34). These should match.
**Why:** Confusing UX inconsistency.
**Solution:** Unify to one label across both screens.
**Effort:** Trivial

### 11. No Loading/Skeleton States for Lists
**What:** Liked list and Matches page show nothing while data loads (no skeleton UI).
**Why:** Feels broken on slow connections.
**Solution:** Add skeleton pill placeholders while loading.
**Effort:** Small (0.5 day)

### 12. No Network Error Handling
**What:** If the user goes offline mid-swipe, likes/passes silently fail (no retry, no queue).
**Why:** Data loss. Users think they saved a name but it wasn't persisted.
**Solution:** Add optimistic UI with retry logic or a simple offline queue.
**Effort:** Medium (1-2 days)

### 13. No App Icon / Splash Screen
**What:** No iOS app icon assets or launch screen configured.
**Why:** Required for App Store submission.
**Solution:** Generate icon set from the logo. Configure splash screen in Capacitor.
**Effort:** Small (0.5 day)

### 14. No Status Bar Styling
**What:** No meta theme-color or Capacitor status bar configuration.
**Why:** Status bar text may be unreadable against the blue background.
**Solution:** Add `<meta name="theme-color" content="#0012ee">` and use Capacitor StatusBar plugin.
**Effort:** Trivial

### 15. No "What's New" / Onboarding for Returning Users
**What:** Once onboarding is complete, there's no way to re-access the tutorial.
**Why:** Users forget swipe gestures. No way to re-learn.
**Solution:** Add a "How to swipe" link in Settings or a help icon on Browse.
**Effort:** Small (0.5 day)

### 16. Couple Mode UX Gap
**What:** In couple mode, `currentPartner` toggles between A/B but there's no UI to switch partners on the browse screen (only a label showing whose turn it is). The switching logic itself is unused — `switchPartner` is never called in any component.
**Why:** Couple mode is a premium feature but isn't fully wired up.
**Solution:** Either implement turn-based switching or simplify to "both partners swipe independently on their own devices" (which is how the backend already works via separate `liked_names` rows).
**Effort:** Medium (1 day)

---

## NICE TO HAVE AFTER LAUNCH (V2)

### 17. Push Notifications
When partner likes a name, or a new match is found. Requires APNs setup.

### 18. Analytics
No event tracking. Add PostHog, Mixpanel, or similar to track swipe rates, conversion, retention.

### 19. Accessibility
No aria-labels on icon buttons. No screen reader support for swipe gestures. Color contrast on some frosted elements may fail WCAG.

### 20. Name Search / Filter on Liked List
Users with many liked names can't find specific ones.

### 21. Onboarding Skip / Resume
If the user force-quits during onboarding, they restart from step 0.

### 22. Dark Mode / Light Mode Toggle
Currently hardcoded to dark blue. Some users may want light mode.

### 23. Localization
Te Reo Māori or other Pacific language options for the UI.

### 24. Rate / Review Prompt
Ask happy users to rate the app on the App Store.

### 25. Share App / Referral
No way to share the app itself (only individual names).

---

## WHAT MAKES IT FEEL LIKE A WEB APP

| Issue | Fix |
|-------|-----|
| No haptic feedback on interactions | Capacitor Haptics |
| Rubber-band scrolling feels different | Native scroll behavior via Capacitor |
| No status bar integration | StatusBar plugin |
| Content behind notch/Dynamic Island | Safe area insets |
| Page transitions feel instant (no native push/pop) | Add slide transitions between routes |
| No splash screen | Capacitor splash screen |
| Pull-to-refresh not native-feeling | Use Capacitor or custom pull-to-refresh |
| Browser URL bar visible in PWA mode | Only fix: native wrapper via Capacitor |

## SCREENS NEEDING MORE POLISH

1. **Subscription page** (`/subscribe`) — simpler than the onboarding version, feels disconnected
2. **Settings page** — long scrollable list with no section grouping or visual breaks
3. **Matches empty state** — "Go to Settings → Couple Mode" instruction feels like web help text, not native

## MOST LIKELY APP STORE REJECTION CAUSES

1. **No functional payment** — advertising premium without IAP
2. **No Privacy Policy URL** — required field in App Store Connect
3. **No account deletion confirmation email** — Apple requires clear account deletion flow (you have delete, but may need email confirmation)
4. **Minimum functionality** — if the name database is too small, Apple may reject for "limited utility"

## LEGAL PAGES REQUIRED

- Privacy Policy (required by Apple)
- Terms of Service
- Data deletion instructions (already have delete account, but needs to be documented)

---

## TOP 10 HIGHEST PRIORITY IMPROVEMENTS

| # | Task | Effort |
|---|------|--------|
| 1 | Add Privacy Policy & Terms pages | Small |
| 2 | Set up Capacitor for iOS | Medium |
| 3 | Integrate RevenueCat for subscriptions | Large |
| 4 | Enforce daily swipe limits for free users | Medium |
| 5 | Add safe area insets & status bar styling | Small |
| 6 | Fix delete-account to clean up partner data | Small |
| 7 | Store feedback in database | Small |
| 8 | Add haptic feedback | Small |
| 9 | Fix gender label inconsistency | Trivial |
| 10 | App icon & splash screen assets | Small |

## SUGGESTED ORDER

1. Fix trivial bugs (gender label, delete-account cleanup) — 1 hour
2. Privacy Policy & Terms pages — half day
3. Feedback storage — half day
4. Swipe limit enforcement — 1 day
5. Safe area insets + status bar — half day
6. Capacitor setup — 1 day
7. App icon + splash screen — half day
8. Haptic feedback — half day
9. Payment integration (RevenueCat) — 3-5 days
10. Testing & polish — 2 days

**Total estimated effort: 10-14 days to launch readiness**

---

## CHECKLIST

- [ ] Privacy Policy page
- [ ] Terms of Service page
- [ ] Capacitor iOS setup
- [ ] App icon assets (1024x1024 + all sizes)
- [ ] Splash/launch screen
- [ ] RevenueCat / IAP integration
- [ ] Daily swipe limit enforcement
- [ ] Safe area insets (notch, Dynamic Island, home indicator)
- [ ] Status bar styling
- [ ] Haptic feedback on swipe, like, pass, undo
- [ ] Fix delete-account partner cleanup
- [ ] Store feedback in database
- [ ] Fix "Surprise" → "Both" label inconsistency in onboarding
- [ ] Email verification enforcement
- [ ] Skeleton loading states
- [ ] Network error handling / offline queue
- [ ] Couple mode UX clarification
- [ ] App Store screenshots
- [ ] App Store description & metadata
- [ ] TestFlight beta testing

