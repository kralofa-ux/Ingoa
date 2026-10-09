import type { CapacitorConfig } from '@capacitor/cli';

// Production config: the native app bundles the built web files (dist).
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
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    SplashScreen: {
      launchAutoHide: false,
      launchFadeOutDuration: 200,
      backgroundColor: '#0010e0',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
