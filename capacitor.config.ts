import type { CapacitorConfig } from '@capacitor/cli';

// Production config: the native app bundles the built web files (dist) and runs offline.
// For live-reload development on a device, temporarily add:
// server: { url: '<preview-url>', cleartext: true }
const config: CapacitorConfig = {
  appId: 'com.ingoa.app',
  appName: 'Ingoa',
  webDir: 'dist',
  ios: {
    contentInset: 'never',
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
