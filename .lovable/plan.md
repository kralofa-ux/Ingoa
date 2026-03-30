

# Ingoa — Updated iOS/Play Store Readiness Audit

## LAUNCH READINESS SCORE: 62 / 100
Up from 52. Privacy/Terms pages, feedback storage, delete-account cleanup, safe area insets, daily swipe limits, and Capacitor config are now in place. Key gaps remain.

---

## COMPLETED SINCE LAST AUDIT
- [x] Privacy Policy & Terms of Service pages
- [x] Daily swipe limit enforcement (20/day, localStorage date-stamped)
- [x] Feedback stored in database
- [x] Delete account cleans up partner data
- [x] Safe area insets & viewport-fit=cover
- [x] Theme-color meta tag
- [x] Capacitor config file created
- [x] Gender label unified to "Both"

---

## CRITICAL — Must fix before submission

### 1. No Payment Integration
The "Upgrade to Premium" button on `/subscribe` and Settings does nothing. No IAP, Stripe, or RevenueCat.
**Why:** App Store/Play Store will reject if premium is advertised without functional payment.
**Fix:** Integrate RevenueCat for iOS IAP + Google Play Billing. Wire `subscription_status` on profiles. Gate unlimited swipes and couple mode behind active subscription.
**Effort:** Large (3-5 days)

### 2. Swipe Limit Bypass
Daily limit is enforced via localStorage only — trivially bypassed by clearing storage or using a different browser.
**Why:** Business model depends on this gate.
**Fix:** Move swipe counting server-side. Add a `daily_swipes` table or column with date, enforce in the `likeName`/`passName` flow via an RPC or edge function.
**Effort:** Medium (1 day)

### 3. Email Verification Not Enforced
After signup, users see "Check your email to verify" but can still sign in without verifying. No check for `email_confirmed_at` on the user object.
**Why:** Spam accounts, App Store reviewers expect proper flows.
**Fix:** After `signIn`, check `user.email_confirmed_at`. If null, sign them out and show "Please verify your email first." Also confirm auto-confirm is disabled in auth settings.
**Effort:** Small (0.5 day)

### 4. No App Icon or Splash Screen Assets
Capacitor config exists but no icon/splash assets are generated.
**Why:** Required for both App Store and Play Store submission.
**Fix:** Generate 1024x1024 app icon from existing logo. Create splash screen. Configure in Capacitor (`@capacitor/splash-screen`).
**Effort:** Small (0.5 day) — mostly asset generation outside Lovable

### 5. Subscription Page Disconnected from Onboarding Version
`/subscribe` page is a simpler, less polished version of the onboarding plan picker. Feels inconsistent.
**Fix:** Reuse the same premium card design from onboarding (dark navy gradient, feature list, Recommended badge).
**Effort:** Small (0.5 day)

---

## IMPORTANT — Should fix before launch

### 6. No Skeleton/Loading States
Liked list and Matches show nothing while data loads.
**Fix:** Add skeleton pill placeholders matching the row height.
**Effort:** Small (0.5 day)

### 7. No Network Error Handling
Likes/passes silently fail if offline. No retry or queue.
**Fix:** Add error toasts on failed Supabase calls. Optionally queue failed writes for retry.
**Effort:** Medium (1 day)

### 8. No Haptic Feedback
Swipes, undo, like/pass have no haptic response. Feels like a website.
**Fix:** Install `@capacitor/haptics`. Add light impact on swipe completion, medium on undo.
**Effort:** Small (0.5 day)

### 9. Couple Mode Not Fully Wired
`switchPartner` is never called. The "Partner A/B turn" label shows but switching is manual/unused.
**Fix:** Simplify: remove turn-based switching UI. Each partner swipes independently on their own device (already supported by backend). Remove `currentPartner` label from browse screen.
**Effort:** Small (0.5 day)

### 10. No Page Transitions
Route changes are instant with no animation — feels like a web page, not a native app.
**Fix:** Add slide/fade transitions using `framer-motion` `AnimatePresence` wrapping the `Routes` outlet.
**Effort:** Small (0.5 day)

### 11. No Accessibility Labels
Icon-only buttons (undo, nav icons) have no `aria-label`. Screen readers can't describe the UI.
**Fix:** Add `aria-label` to all icon buttons and interactive elements.
**Effort:** Small (0.5 day)

### 12. Auth Page Missing "Sign in with Apple"
Apple requires apps with third-party login to also offer Sign in with Apple.
**Fix:** Add Apple OAuth button on Auth page using Lovable Cloud's managed Apple Auth. If email/password is the only method, this may not be required — but adding it improves conversion and avoids potential rejection.
**Effort:** Medium (1 day)

---

## NICE TO HAVE — Post-launch (V2)

| Feature | Notes |
|---------|-------|
| Push notifications | Partner liked a name, new match found |
| Analytics (PostHog/Mixpanel) | Track swipe rates, retention, conversion |
| Name search on Liked list | Filter/search when list grows large |
| Onboarding resume on force-quit | Currently restarts from step 0 |
| Dark/Light mode toggle | Currently hardcoded dark blue |
| Rate/Review prompt | Ask after N matches |
| Share/Referral | Share the app itself |
| Localization (Te Reo Māori UI) | Pacific language options |

---

## MOST LIKELY REJECTION CAUSES

| # | Cause | Status |
|---|-------|--------|
| 1 | No functional IAP | Still open |
| 2 | No Privacy Policy URL | Fixed |
| 3 | Missing Sign in with Apple (if social login exists) | Open |
| 4 | No app icon | Open |
| 5 | Small name database ("limited utility") | Check DB count |

---

## UPDATED TOP 10 PRIORITIES

| # | Task | Effort | Status |
|---|------|--------|--------|
| 1 | Integrate RevenueCat for IAP | Large | Open |
| 2 | Server-side swipe limit enforcement | Medium | Open |
| 3 | Email verification enforcement | Small | Open |
| 4 | Redesign `/subscribe` to match onboarding | Small | Open |
| 5 | Add Sign in with Apple | Medium | Open |
| 6 | App icon & splash screen assets | Small | Open |
| 7 | Add haptic feedback | Small | Open |
| 8 | Skeleton loading states | Small | Open |
| 9 | Page transitions | Small | Open |
| 10 | Simplify couple mode UX | Small | Open |

## SUGGESTED ORDER

1. Email verification enforcement — 0.5 day
2. Redesign `/subscribe` page — 0.5 day
3. Skeleton loading states — 0.5 day
4. Page transitions — 0.5 day
5. Simplify couple mode — 0.5 day
6. Haptic feedback — 0.5 day
7. Sign in with Apple — 1 day
8. Server-side swipe limits — 1 day
9. RevenueCat IAP integration — 3-5 days
10. App icon + splash (outside Lovable) — 0.5 day

**Remaining effort: ~8-11 days to store-ready**

