

## Plan: UI Polish, Onboarding Flow & Settings — 19 Items

Due to scope, this will be implemented in **two rounds**.

---

### ROUND 1 — Visual Polish & Existing Pages (Items 1–10, 12)

**`src/pages/Onboarding.tsx`** — Items 1, 2, 3, 8, 12

| # | Change |
|---|--------|
| 1 | Solo/Couple: selected gets `ring-4 ring-white/60 shadow-lg scale-105 text-white`; unselected gets `opacity-50 text-white/60` (stronger contrast) |
| 2 | Gender: remove `opacity-80` from unselected. All buttons stay full brightness. Selected gets `ring-4 ring-white/60 shadow-lg scale-105`. Rename "Surprise" → "Both" |
| 3 | Name Preview heading → "See How It Looks" |
| 8 | Fiji color (index 4): `#0049BB` → `#0055CC` for better gradient balance |
| 12 | Move progress dots to bottom: `absolute bottom-8 left-0 right-0` with `justify-center`. Remove `mb-10` from top. Restructure layout so content + buttons are above dots |

**`src/pages/Settings.tsx`** — Items 5, 6, 7

| # | Change |
|---|--------|
| 5 | Replace Name Preview button with a `Switch` toggle from `@/components/ui/switch`. When OFF hide inputs, when ON show them. Import Switch component |
| 6 | Centre-align feedback section and name preview section with `text-center` |
| 7 | Remove the ArrowLeft button and its container div. Just render `<h1>` directly |

**`src/components/PartnerConnect.tsx`** — Item 4

- Code input: change from `frosted-pill-selected` to `bg-white/15 text-white placeholder:text-white/50 border border-white/20`
- "Enter Partner's Code" button: `bg-primary text-white` instead of `frosted-pill-selected`
- Heading size increase to `text-xl`

**`src/components/CultureIcon.tsx`** — Item 9

- Replace Aotearoa reference: change from tino flag to NZ emoji `🇳🇿`. Move `"Aotearoa"` from `svgMap` to `emojiMap` with value `"🇳🇿"`

**`src/pages/LikedList.tsx`** — Item 10

- Wrap list items with `AnimatePresence`. Add `layout` to each item and `exit={{ opacity: 0, height: 0, marginBottom: 0 }}` with `transition={{ duration: 0.3 }}`

**`src/pages/Matches.tsx`** — Item 10

- Same `AnimatePresence` + `layout` + exit animation for match items

---

### ROUND 2 — New Features & Pages (Items 11, 13–19)

**`src/components/NameDetail.tsx`** — Item 11

- Add name preview section below meaning. Pull `middleName`, `lastName`, `showNamePreview` from `useApp()`. Show: "{name.name}", "{name.name} {middleName}", "{name.name} {middleName} {lastName}" formatted as stacked preview lines

**`src/pages/Onboarding.tsx`** — Items 13, 14, 16, 17

- **Item 13**: New tutorial step after gender (step 4). Three rows with arrow icons: Swipe Right → Like, Swipe Left → Pass, Tap Corner → Undo
- **Item 16**: If mode === "couple", insert a partner connect step after mode selection. Embed `<PartnerConnect />` component. Solo skips this step
- **Items 14/17**: New subscription step before final "Start Exploring". Free vs Premium comparison. "Upgrade" button (placeholder) and "Continue Free" to proceed. Pricing shown only after tapping upgrade
- Dynamic step array built based on mode selection. `canProceed` and `nextStep` updated accordingly

**`src/pages/Subscription.tsx`** (new) — Item 14

- Standalone page at `/subscribe` for access from Settings
- Free tier: 20 swipes/day, limited features
- Premium: unlimited swipes, couple mode, full catalogue
- "Continue Free" and "Upgrade" buttons

**`src/pages/Settings.tsx`** — Item 15

- Add "Upgrade to Premium" button navigating to `/subscribe`

**`src/components/BottomNav.tsx`** — Item 18

- Replace icons with Pacific-influenced Lucide alternatives:
  - Swipe: `Waves` 
  - Liked: `Heart` (keep)
  - Matches: `Handshake`
  - Settings: `Shell`

**`src/pages/LikedList.tsx` & `src/pages/Matches.tsx`** — Item 19

- Redesign empty states: bold uppercase heading, Pacific geometric SVG decorations (triangles/waves pattern), styled message "Start swiping to discover names"

**`src/App.tsx`** — Route for `/subscribe`

---

### File Summary

| File | Items |
|------|-------|
| `Onboarding.tsx` | 1, 2, 3, 8, 12, 13, 16, 17 |
| `Settings.tsx` | 5, 6, 7, 15 |
| `PartnerConnect.tsx` | 4 |
| `CultureIcon.tsx` | 9 |
| `LikedList.tsx` | 10, 19 |
| `Matches.tsx` | 10, 19 |
| `NameDetail.tsx` | 11 |
| `BottomNav.tsx` | 18 |
| `Subscription.tsx` (new) | 14 |
| `App.tsx` | route addition |

I'll implement **Round 1 first** (items 1–10, 12), then Round 2 in a follow-up.

