# Architecture rules

- Native launch artwork is generated with `npm run assets:native` from CDN-backed icon and splash sources, with Android 12 launch-theme colors set by the generator; onboarding uses a separate transparent CDN-backed flower with empty margins trimmed to preserve its display size.
- Keep the Capacitor splash visible until the initial auth check and first app paint, then dismiss it through a native-only component; this prevents a blank launch frame without delaying browser users.
- Push notifications: devices register through the `push` backend function (service role writes `push_tokens`); mutual-match alerts are sent server-side via the Firebase Cloud Messaging connector so no push credentials ship in the app.

- Saved swipe state uses account-keyed React Query cache and paginated reads in `swipeData`; clear it on account changes to prevent stale cross-account state.
- Keep name conversion, deck ordering, pagination, entitlement interpretation and deletion coverage in focused tested helpers so all callers share the same rules.
- Persist swipes and profile changes successfully before reporting success; undo must delete the saved row so reload cannot resurrect it.
- Serialize native billing initialization before identifying the user, and discard outdated auth/subscription responses to prevent startup and account-switch races.
- Keep subscription actions separate from presentation and focused onboarding/settings sections separate from page orchestration to limit responsibility growth.
- Define feature colors and gradients as role-named global CSS tokens and preserve custom control layouts through the shared Button variant so cleanup does not redesign the app.
