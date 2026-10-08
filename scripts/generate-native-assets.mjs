import { mkdtemp, readFile, writeFile, copyFile, access, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const exists = async (path) => access(path).then(() => true, () => false);
const ios = await exists('ios/App');
const android = await exists('android/app');
if (!ios && !android) {
  throw new Error('Add a phone project first: npx cap add ios and/or npx cap add android.');
}
const staging = await mkdtemp(join(tmpdir(), 'ingoa-native-assets-'));
try {
  for (const name of ['icon-only.png', 'icon-foreground.png']) {
    await copyFile('resources/icon.png', join(staging, name));
  }
  const origin = process.env.INGOA_ASSET_ORIGIN || 'https://id-preview--08ae3a55-f8af-4882-b86a-13025d74b3bb.lovable.app';
  for (const [pointerPath, destinations] of [
    ['resources/splash.png.asset.json', ['splash.png', 'splash-dark.png']],
    ['resources/icon-background.png.asset.json', ['icon-background.png']],
  ]) {
    const pointer = JSON.parse(await readFile(pointerPath, 'utf8'));
    const response = await fetch(new URL(pointer.url, origin));
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
      throw new Error(`Unable to download ${pointer.original_filename}. Check your connection or INGOA_ASSET_ORIGIN.`);
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    for (const name of destinations) await writeFile(join(staging, name), bytes);
  }
  const result = spawnSync(process.execPath, [
    'node_modules/@capacitor/assets/bin/capacitor-assets', 'generate',
    '--assetPath', staging, ...(ios ? ['--ios'] : []), ...(android ? ['--android'] : []),
  ], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error('Phone artwork generation failed.');

  // Android 12+ uses the system icon splash, not the older full-screen bitmap.
  if (android) {
    const stylesPath = 'android/app/src/main/res/values/styles.xml';
    const styles = await readFile(stylesPath, 'utf8');
    const launchTheme = /(<style\b[^>]*name="AppTheme.NoActionBarLaunch"[^>]*>)([\s\S]*?)(<\/style>)/;
    if (!launchTheme.test(styles)) throw new Error('Android launch theme was not found; configure its splash background manually.');
    await writeFile(stylesPath, styles.replace(launchTheme, (_, start, body, end) => {
      const clean = body.replace(/\s*<item name="windowSplashScreen(?:Background|AnimatedIcon)"[^>]*>[\s\S]*?<\/item>/g, '');
      return `${start}${clean}\n        <item name="windowSplashScreenBackground">@color/ingoa_splash_background</item>\n        <item name="windowSplashScreenAnimatedIcon">@mipmap/ic_launcher_foreground</item>\n    ${end}`;
    }));
    for (const directory of ['values', 'values-night']) {
      const folder = `android/app/src/main/res/${directory}`;
      await mkdir(folder, { recursive: true });
      await writeFile(`${folder}/ingoa-splash-colors.xml`, '<?xml version="1.0" encoding="utf-8"?>\n<resources><color name="ingoa_splash_background">#0010e0</color></resources>\n');
    }
  }
} finally {
  await rm(staging, { recursive: true, force: true });
}