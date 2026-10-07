import { Purchases, LOG_LEVEL, PURCHASES_ERROR_CODE } from "@revenuecat/purchases-capacitor";
import { RevenueCatUI, PAYWALL_RESULT } from "@revenuecat/purchases-capacitor-ui";
import { Capacitor } from "@capacitor/core";

// ─── Constants ───────────────────────────────────────────────────────
// Public SDK keys (safe in client code). Replace with live keys from RevenueCat before release.
const RC_TEST_KEY = "test_iQKgTFYODjRWiMGahKWImRvSrGC";
const RC_IOS_KEY = ""; // appl_...
const RC_ANDROID_KEY = ""; // goog_...
function getApiKey(): string {
  const platform = Capacitor.getPlatform();
  if (platform === "ios" && RC_IOS_KEY) return RC_IOS_KEY;
  if (platform === "android" && RC_ANDROID_KEY) return RC_ANDROID_KEY;
  return RC_TEST_KEY;
}
const ENTITLEMENT_ID = "INGOA Pro";

// ─── Initialisation ──────────────────────────────────────────────────
let initialised = false;

export async function initRevenueCat(appUserId?: string): Promise<void> {
  if (initialised) return;
  if (!Capacitor.isNativePlatform()) {
    console.log("[RevenueCat] Skipping init — not a native platform");
    return;
  }

  try {
    await Purchases.setLogLevel({ level: import.meta.env.DEV ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN });
    await Purchases.configure({
      apiKey: getApiKey(),
      appUserID: appUserId ?? undefined,
    });
    initialised = true;
    console.log("[RevenueCat] SDK configured");
  } catch (err) {
    console.error("[RevenueCat] Init failed:", err);
  }
}

// ─── Customer Info & Entitlement Checks ──────────────────────────────
export interface SubscriptionStatus {
  isSubscribed: boolean;
  tier: "free" | "monthly" | "lifetime";
  expiresDate: string | null;
}

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  if (!Capacitor.isNativePlatform()) {
    return { isSubscribed: false, tier: "free", expiresDate: null };
  }

  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];

    if (!entitlement) {
      return { isSubscribed: false, tier: "free", expiresDate: null };
    }

    // Determine tier from product identifier
    const productId = entitlement.productIdentifier?.toLowerCase() ?? "";
    let tier: "monthly" | "lifetime" = "monthly";
    if (productId.includes("lifetime")) {
      tier = "lifetime";
    }

    return {
      isSubscribed: true,
      tier,
      expiresDate: entitlement.expirationDate ?? null,
    };
  } catch (err) {
    console.error("[RevenueCat] Failed to get customer info:", err);
    return { isSubscribed: false, tier: "free", expiresDate: null };
  }
}

export async function restorePurchases(): Promise<SubscriptionStatus> {
  if (!Capacitor.isNativePlatform()) {
    return { isSubscribed: false, tier: "free", expiresDate: null };
  }

  try {
    const { customerInfo } = await Purchases.restorePurchases();
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];

    if (!entitlement) {
      return { isSubscribed: false, tier: "free", expiresDate: null };
    }

    const productId = entitlement.productIdentifier?.toLowerCase() ?? "";
    const tier = productId.includes("lifetime") ? "lifetime" : "monthly";

    return {
      isSubscribed: true,
      tier,
      expiresDate: entitlement.expirationDate ?? null,
    };
  } catch (err) {
    console.error("[RevenueCat] Restore failed:", err);
    throw err;
  }
}

// ─── Login / Logout ──────────────────────────────────────────────────
export async function loginRevenueCat(appUserId: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await Purchases.logIn({ appUserID: appUserId });
  } catch (err) {
    console.error("[RevenueCat] Login failed:", err);
  }
}

export async function logoutRevenueCat(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await Purchases.logOut();
  } catch (err) {
    console.error("[RevenueCat] Logout failed:", err);
  }
}

// ─── Paywall ─────────────────────────────────────────────────────────
export async function presentPaywall(): Promise<{
  purchased: boolean;
  restored: boolean;
}> {
  if (!Capacitor.isNativePlatform()) {
    console.log("[RevenueCat] Paywall not available on web");
    return { purchased: false, restored: false };
  }

  try {
    const { result } = await RevenueCatUI.presentPaywall();
    return {
      purchased: result === PAYWALL_RESULT.PURCHASED,
      restored: result === PAYWALL_RESULT.RESTORED,
    };
  } catch (err) {
    console.error("[RevenueCat] Paywall error:", err);
    return { purchased: false, restored: false };
  }
}

export async function presentPaywallIfNeeded(): Promise<{
  purchased: boolean;
  restored: boolean;
}> {
  if (!Capacitor.isNativePlatform()) {
    return { purchased: false, restored: false };
  }

  try {
    const { result } = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: ENTITLEMENT_ID,
    });
    return {
      purchased: result === PAYWALL_RESULT.PURCHASED,
      restored: result === PAYWALL_RESULT.RESTORED,
    };
  } catch (err) {
    console.error("[RevenueCat] Paywall error:", err);
    return { purchased: false, restored: false };
  }
}

// ─── Customer Center ─────────────────────────────────────────────────
export async function presentCustomerCenter(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.log("[RevenueCat] Customer Center not available on web");
    return;
  }

  try {
    await RevenueCatUI.presentCustomerCenter();
  } catch (err) {
    console.error("[RevenueCat] Customer Center error:", err);
    throw err;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────
export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

export { ENTITLEMENT_ID, PURCHASES_ERROR_CODE };
