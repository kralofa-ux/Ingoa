import { Purchases, LOG_LEVEL, PURCHASES_ERROR_CODE } from "@revenuecat/purchases-capacitor";
import { RevenueCatUI, PAYWALL_RESULT } from "@revenuecat/purchases-capacitor-ui";
import { Capacitor } from "@capacitor/core";

// ─── Constants ───────────────────────────────────────────────────────
// Public SDK keys (safe in client code). Replace with live keys from RevenueCat before release.
const RC_TEST_KEY = "test_iQKgTFYODjRWiMGahKWImRvSrGC";
const RC_IOS_KEY = "appl_xrLdNidncifgczwGydxDPwTvIpm";
const RC_ANDROID_KEY = "goog_xYMyoPpjxfQbUskxGideGKewsaX";
function getApiKey(): string {
  const platform = Capacitor.getPlatform();
  if (platform === "ios" && RC_IOS_KEY) return RC_IOS_KEY;
  if (platform === "android" && RC_ANDROID_KEY) return RC_ANDROID_KEY;
  return RC_TEST_KEY;
}
const ENTITLEMENT_ID = "INGOA Pro";
const ENTITLEMENT_IDS = ["INGOA Pro", "ingoa_pro"];
function findActiveEntitlement(active: Record<string, { productIdentifier?: string; expirationDate?: string | null }>) {
  for (const id of ENTITLEMENT_IDS) if (active[id]) return active[id];
  const wanted = ENTITLEMENT_IDS.map((i) => i.toLowerCase().replace(/[\s_]/g, ""));
  const key = Object.keys(active).find((k) => wanted.includes(k.toLowerCase().replace(/[\s_]/g, "")));
  return key ? active[key] : undefined;
}

// ─── Initialisation ──────────────────────────────────────────────────
let initialised = false;
let initialization: Promise<void> | undefined;

export async function initRevenueCat(appUserId?: string): Promise<void> {
  if (!Capacitor.isNativePlatform() || initialised) return;
  if (!initialization) initialization = (async () => {
    await Purchases.setLogLevel({ level: import.meta.env.DEV ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN });
    await Purchases.configure({apiKey:getApiKey(),appUserID:appUserId});
    initialised=true;
  })().catch(error=>{initialization=undefined;throw error;});
  await initialization;
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
    await initRevenueCat();
    const { customerInfo } = await Purchases.getCustomerInfo();
    const entitlement = findActiveEntitlement(customerInfo.entitlements.active);

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
    throw err;
  }
}

export async function restorePurchases(): Promise<SubscriptionStatus> {
  if (!Capacitor.isNativePlatform()) {
    return { isSubscribed: false, tier: "free", expiresDate: null };
  }

  try {
    await initRevenueCat();
    const { customerInfo } = await Purchases.restorePurchases();
    const entitlement = findActiveEntitlement(customerInfo.entitlements.active);

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
    await initRevenueCat();
    await Purchases.logIn({ appUserID: appUserId });
  } catch (err) {
    console.error("[RevenueCat] Login failed:", err);
    throw err;
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
    await initRevenueCat();
    const { result } = await RevenueCatUI.presentPaywall();
    return {
      purchased: result === PAYWALL_RESULT.PURCHASED,
      restored: result === PAYWALL_RESULT.RESTORED,
    };
  } catch (err) {
    console.error("[RevenueCat] Paywall error:", err);
    throw err;
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
