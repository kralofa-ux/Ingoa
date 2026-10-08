# Ingoa native splash screen

The app icon uses the uploaded artwork in `icon.png.asset.json`. Icon and splash sources are stored as CDN asset pointers and downloaded only while generating native resources. Light and dark mode use the same branding.

After pulling this project onto your computer:

1. Run `npm install`.
2. Add any missing phone projects: `npx cap add ios` / `npx cap add android`.
3. Run `npm run build`.
4. Run `npm run assets:native` to generate icons and splash images and configure the Android system splash background.
5. Run `npx cap sync`.
6. Open Xcode or Android Studio and test a cold launch on a device.

Use this project's `assets:native` command rather than a bare `npx @capacitor/assets generate`, which does not download the CDN-backed source artwork.

The splash remains visible until the initial sign-in check completes and the first app frame is painted, then fades out. The browser preview is unchanged. Android 12 and later display the system-controlled centered icon splash; older Android and iOS use the full splash artwork. Native launch behavior still requires device testing.

If the project preview address changes, set `INGOA_ASSET_ORIGIN` to the new public app address before running the command.

Capacitor background reading: https://lovable.dev/blog/capacitor