import { Capacitor } from "@capacitor/core";
import { supabase } from "@/lib/supabase";

let currentToken: string | null = null;
let listenersAdded = false;

/** Ask permission and register this phone for match notifications. Native only. */
export async function initPush(navigate?: (path: string) => void): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");

    if (!listenersAdded) {
      listenersAdded = true;
      await PushNotifications.addListener("registration", async ({ value }) => {
        currentToken = value;
        await supabase.functions.invoke("push", {
          body: { action: "register", token: value, platform: Capacitor.getPlatform() },
        });
      });
      await PushNotifications.addListener("registrationError", (err) =>
        console.warn("[Push] registration error", err)
      );
      await PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
        const path = action.notification?.data?.path;
        if (path && navigate) navigate(path);
      });
    }

    let perm = await PushNotifications.checkPermissions();
    if (perm.receive === "prompt" || perm.receive === "prompt-with-rationale") {
      perm = await PushNotifications.requestPermissions();
    }
    if (perm.receive !== "granted") return;
    await PushNotifications.register();
  } catch (e) {
    console.warn("[Push] init failed", e);
  }
}

/** Remove this phone's token on sign-out so the old account stops getting alerts. */
export async function unregisterPush(): Promise<void> {
  if (!Capacitor.isNativePlatform() || !currentToken) return;
  try {
    await supabase.functions.invoke("push", { body: { action: "unregister", token: currentToken } });
  } catch { /* ignore */ }
  currentToken = null;
}

/** Tell the server a name was liked; it notifies the partner if it's a mutual match. */
export function notifyLiked(nameId: string): void {
  supabase.functions.invoke("push", { body: { action: "liked", name_id: nameId } }).catch(() => {});
}
