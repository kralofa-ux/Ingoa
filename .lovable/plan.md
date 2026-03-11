

# Ingoa — Gap Analysis and Implementation Plan

## Current State vs Spec

What's built:
- Auth (email/password), onboarding, culture multi-select, gender filter
- Swipe card deck with like/pass/undo/refresh
- Liked list, Matches page, bottom nav
- Cloud persistence (liked_names, passed_names, profiles tables)
- Design refresh (ocean blue/teal/sand palette)

## Key Gaps and Potential Issues

### Potential Issues
1. **Web app, not native iOS/Android** — Lovable builds web apps (React/Vite). The spec calls for iOS + Android with Apple IAP and Google Play Billing. This cannot be done natively in Lovable. Options: PWA for mobile-like experience, or wrap in Capacitor/Expo later.
2. **Push notifications** — Not possible in a pure web app without service workers / PWA setup. Would need native wrapper for full push support.
3. **Offline caching of 200 names** — Requires service worker / PWA manifest. Partial solution possible with localStorage.
4. **Swipe limits (20/day)** — Spec says keep unlimited for now, but architecture should be ready.
5. **Name database** — Currently ~148 names hardcoded in a TS file. Spec wants ~3200. Should move to database and use AI to generate bulk entries.
6. **Couple mode** — Currently faked with local partner A/B toggle. Real couple mode needs partner connection via 6-digit codes, shared data via database.

### Proposed Task Breakdown (Priority Order)

**Phase 1 — UI/UX Alignment (do first)**
1. **Remove swipe buttons, gestures only** — Spec says no Pass/Like buttons. Only swipe gestures + undo in top corner. Remove the bottom action buttons (X, Heart, Undo, Refresh).
2. **Single card visible** — Spec says only one card visible, next card fades in smoothly. Remove the stacked second card behind.
3. **Card layout reorder** — Spec hierarchy: Culture label (top) → Name (center) → Gender indicator (below) → Meaning (bottom). Currently meaning is above gender.
4. **Swipe tutorial overlay** — Show gesture hints for first 5 swipes, then hide.
5. **Settings page** — Create Settings page: gender preference, cultures, name preview toggle, disconnect partner, send feedback, delete account.
6. **Name detail view** — Tap a name in lists to open detail card (Name, Gender, Culture, Meaning).
7. **List features** — Add drag-and-drop reorder, star/favourite, share name.
8. **Empty states** — Match spec wording for empty swipe/liked/match screens.

**Phase 2 — Data & Backend**
9. **Move names to database** — Create a `names` table with fields: name, culture, gender, meaning, commonality_score, source_type, source_reference, verified_by, status, created_at. Migrate existing names + generate more via AI.
10. **Weighted randomization** — Implement 40/40/20 common/normal/rare weighting using commonality_score.
11. **Analytics tracking** — Add swipe events table: name_like_count, name_pass_count, match_count per name.

**Phase 3 — Couple Mode (real)**
12. **6-digit invite codes** — Generate codes, store in DB with 24hr expiry, connect partners.
13. **Couple controls** — Only paid subscriber controls culture/gender filters.
14. **Match detection** — Real cross-user match logic with animation + notification placeholder.
15. **Partner disconnect** — With match/liked data cleanup rules.

**Phase 4 — Premium & Admin**
16. **Swipe limit system** — 20/day for free, unlimited for premium (when ready).
17. **Admin dashboard** — Web interface for name CRUD, CSV import, analytics.
18. **Subscription placeholder** — Premium upgrade UI (actual payments need native wrapper).

### What should we tackle first?

I recommend starting with **Phase 1** (UI/UX alignment) since it's all frontend work we can do right now, and it will make the app feel much closer to the spec. The biggest single task is the Settings page.

Shall I proceed with Phase 1, or would you like to prioritize differently?

