import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

/** Mounted only after the initial auth check; hide after the first painted app frame. */
export default function NativeSplash() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let secondFrame: number | undefined;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        void SplashScreen.hide({ fadeOutDuration: 200 }).catch((error) => {
          console.warn('Unable to dismiss native splash screen', error);
        });
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame !== undefined) cancelAnimationFrame(secondFrame);
    };
  }, []);
  return null;
}