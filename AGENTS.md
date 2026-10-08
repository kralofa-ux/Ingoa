# Architecture rules

- Native launch artwork is generated with `npm run assets:native` from CDN-backed icon and splash sources, with Android 12 launch-theme colors set by the generator; onboarding uses the same icon pointer to keep the app icon consistent without duplicating binaries.
- Keep the Capacitor splash visible until the initial auth check and first app paint, then dismiss it through a native-only component; this prevents a blank launch frame without delaying browser users.