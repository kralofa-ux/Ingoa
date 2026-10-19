# Ingoa code audit and proposed cleanup

## Audit result
The app needs reliability fixes before cosmetic cleanup. No application code, dependencies, database settings, or security findings have been changed.

**Checks completed:** public pages and signed-in Browse, Liked Names, Matches, Settings and Subscription opened without runtime exceptions; an existing liked name opened centrally and closed successfully. These were read-only checks—not purchase, partner-link or destructive account-deletion tests. Native iOS/Android behavior remains unverified.

**Automated checks:** the existing test passed, but only asserts `true`; it protects no actual app behavior. The code-quality check reports **32 errors and 10 warnings**, primarily loose types and existing framework/template warnings. A fresh production build was not run.

## Confirmed problems, ranked by user cost

### Must fix
1. **Onboarding paid-plan buttons lead to Not Found.** They navigate to `/subscription`; the actual page is `/subscribe`. New users cannot reach payment from those buttons. Evidence: `Onboarding.tsx:72–85`; `App.tsx:62`.
2. **Undo is not saved.** Both delete requests are constructed without executing them. A name appears undone, then returns to its old saved state on reload. Evidence: `AppContext.tsx:163–187`.
3. **The swipe deck skips unseen names.** Each swipe removes and reshuffles names while also increasing an index into the shrinking list. It can report the end while names remain; undo does not reliably return the previous card. Evidence: `SwipeDeck.tsx:51–101`.
4. **Account changes retain old state.** Sign-out does not clear likes/history/preferences in the app provider, and an empty likes response does not replace the previous list. Late requests can also restore obsolete state. Evidence: `AppContext.tsx:61–112`.
5. **Errors are repeatedly shown as success or empty results.** Swipe writes ignore errors; Settings shows Saved before checking the result; onboarding proceeds after failed saves; partner/match failures appear as disconnected/no matches; name-loading failure appears as the end of the catalogue. Evidence: `AppContext.tsx:123–208`; `Settings.tsx:53–73`; `Onboarding.tsx:58–85`; `usePartner.ts:31–39`; `Matches.tsx:28–64`; `SwipeDeck.tsx:29,209–230`.
6. **Account deletion is incomplete.** The deletion function omits feedback, daily swipe records and push tokens; these have no automatic user-deletion cascade in their migrations. It also ignores cleanup errors, and the page does not clear the local session after success. Users are told all data is removed without this being ensured. Evidence: `delete-account/index.ts:45–80`; `Settings.tsx:80–90`; relevant table migrations.
7. **Startup and native billing have competing initialization paths.** Routing becomes ready before the profile arrives; RevenueCat configuration, login and entitlement checks are not serialized. This can misroute existing users into onboarding or temporarily show a paid user as free. Evidence: `AuthContext.tsx:115–150`; `App.tsx:30–37,54`; `revenuecat.ts:28–45,55–82`.

### Should fix
8. **Daily swipe count has timing and midnight issues.** Swiping starts before the count is loaded; concurrent responses can overwrite newer counts; a page kept open across midnight does not refresh its allowance. Evidence: `SwipeDeck.tsx:30–95`.
9. **Collection reads have no completeness handling.** Names, likes, passes, matches and billing user lookup are unpaginated. The lifetime purchase check only examines ten recent checkout sessions. Results can be missed as data grows; current catalogue truncation was not demonstrated. Evidence: `useNames.ts:9–12`; `AppContext.tsx:85–98`; `Matches.tsx:36–48`; `stripe-webhook/index.ts:59–64,86–90`; `check-subscription/index.ts:92–100`.
10. **Partner and notification failures are difficult to recover from.** An invitation sender does not observe connection changes while waiting; push registration/unregistration ignores returned errors and can discard the token before removal is confirmed. Evidence: `usePartner.ts:31–45`; `push.ts:15–19,42–47`.
11. **The advertised name weighting has no effect.** The helper appends all excluded quota leftovers and then shuffles everything, producing ordinary random ordering rather than 40/40/20 weighting. Evidence: `useNames.ts:58–73`.

### Structural cleanup
12. **A half-finished admin feature remains unreachable.** The 450-line Admin page and its hook have no route or entry point; legacy same-device partner A/B state coexists with the current linked-account approach. Remove only the confirmed unused client chain, not deployed services merely lacking frontend imports.
13. **Large files mix presentation and operations.** Subscription, Settings, Onboarding and the contexts combine several unrelated responsibilities. Premium presentation, name-row conversion and entitlement-to-status logic are duplicated.
14. **Styles bypass the shared design system.** Settings, onboarding, subscription, swipe and detail views use local color values and raw controls alongside shared tokens/components. This makes fixes drift between screens. Preserve the current Ingoa appearance while consolidating them.

## Ordered implementation plan
Each numbered stage is a separate checkpoint. Structural refactors preserve behavior; the explicit bug fixes above are deliberate behavior corrections. No rewrite, new features, price changes, entitlement changes, or dependency upgrades.

1. **Protect critical flows and remove confirmed dead client code.** Add failing regression tests for plan navigation behavior, undo persistence, deck exhaustion, user changes, save failures and deletion cleanup. Remove the orphaned Admin/useAdmin chain and unused helpers only after checking references. Do not add an admin page.
   - Verify: regression tests demonstrate each existing failure; public and signed-in pages still open after deletions.
2. **Merge duplicate pure logic.** Share name-row conversion, purchase-status conversion, preference options and premium presentation. Replace unnecessary casts with generated/SDK types without editing generated files.
   - Verify: mapper tests and preview comparison of name cards, settings and paywall; retain the current visual appearance.
3. **Repair persistence and complete the linked-account model.** Execute/await undo and writes, handle failures and idempotent conflicts, clear account state, protect against stale responses, and complete deletion cleanup/session exit. Remove unused same-device A/B state after proving it has no consumers.
   - Verify: isolated test accounts—like/pass → undo → reload; failed-save recovery; switch into an empty account; deletion fixture has no remaining app-owned records. Never delete the owner's account to test.
4. **Stabilize startup, deck and plan navigation.** Deduplicate auth/profile readiness; serialize native billing initialization; fix onboarding navigation/saves; keep stable deck ordering and exact undo restoration; reconcile liked ordering; handle daily-count hydration and day rollover.
   - Verify: startup and deck tests; signed-in reload and onboarding-to-plan flow; count tests with a controlled clock. RevenueCat native initialization and restoration require an iPhone/Android build before claiming device success.
5. **Consolidate data access and refresh behavior.** Use user-scoped cached queries for swipe/partner/match data; paginate collection reads deterministically; batch name lookups; refresh pending invitations/connections and display separate loading/error/empty states. Make billing lookups and token writes check results and retry appropriately.
   - Verify: above-cap fixtures, network-failure tests, two-account connection/match checks, billing fixtures and push registration error tests. Live purchase and notification delivery require configured services/devices.
6. **Split remaining multi-job screens and unify styles.** Extract focused sections and hooks; replace duplicated hardcoded styles with semantic tokens and shared button variants. Resolve actionable lint errors without weakening rules or editing managed files. Record structural rules in AGENTS.md.
   - Verify: full meaningful test suite, lint comparison, preview checks at phone and desktop sizes, and available build diagnostics. Explain any remaining generated-file warnings rather than silently suppressing them.

## Security and external verification
The saved security scans contain **no reported findings**, but they are marked out of date. The last deep scan is **8 October 2026**, eleven days before this audit. Run a new deep scan from the **Security tab**; the current app cannot be described as secure from these stale results. This review does not replace that scan or independently perform security analysis.

Real store purchases, Apple sign-in return-to-app behavior, native launch artwork and push delivery still need device testing. Nothing here establishes current RevenueCat/App Store configuration or Firebase delivery.

## Approval
Approve this plan to begin with Stage 1. No application cleanup or package updates will occur before approval.
