# Architecture rules

- Native launch artwork is generated with `npm run assets:native` from the app icon and CDN-backed splash sources, with Android 12 launch-theme colors set by the generator; this keeps both platforms consistent without changing web assets.
- Keep the Capacitor splash visible until the initial auth check and first app paint, then dismiss it through a native-only component; this prevents a blank launch frame without delaying browser users.