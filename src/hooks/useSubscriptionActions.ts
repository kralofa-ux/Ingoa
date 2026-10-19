import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { presentPaywall, presentCustomerCenter, restorePurchases } from '@/lib/revenuecat';
import { errorMessage } from '@/lib/errors';
export function useSubscriptionActions() {
 const navigate=useNavigate();const [searchParams]=useSearchParams();
 const {checkSubscription}=useAuth();const {toast}=useToast();
  const [loadingPrice, setLoadingPrice] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  // Handle success redirect (web/Stripe only)
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      void checkSubscription();
      toast({ title: "Payment received", description: "Checking your premium access." });
      window.history.replaceState({}, "", "/subscribe");
    }
  }, [searchParams, checkSubscription, toast]);

  // ── Native: show RevenueCat paywall ────────────────────────────────
  const handleNativePaywall = async () => {
    setLoadingPrice("native");
    try {
      const { purchased, restored } = await presentPaywall();
      if (purchased || restored) {
        await checkSubscription();
        toast({ title: "Welcome to Premium! 🎉", description: "Your upgrade is now active." });
      }
    } catch (e: unknown) {
      toast({ title: "Error", description: errorMessage(e) || "Purchase failed", variant: "destructive" });
    } finally {
      setLoadingPrice(null);
    }
  };

  // ── Native: restore purchases ──────────────────────────────────────
  const handleRestore = async () => {
    setRestoring(true);
    try {
      const status = await restorePurchases();
      await checkSubscription();
      if (status.isSubscribed) {
        toast({ title: "Purchases restored! 🎉", description: "Your premium access is active." });
      } else {
        toast({ title: "No purchases found", description: "We couldn't find any previous purchases." });
      }
    } catch (e: unknown) {
      toast({ title: "Restore failed", description: errorMessage(e) || "Please try again", variant: "destructive" });
    } finally {
      setRestoring(false);
    }
  };

  // ── Native: customer center (manage subscription) ──────────────────
  const handleNativeManage = async () => {
    setPortalLoading(true);
    try {
      await presentCustomerCenter();
      await checkSubscription();
    } catch (e: unknown) {
      toast({ title: "Error", description: errorMessage(e) || "Failed to open subscription manager", variant: "destructive" });
    } finally {
      setPortalLoading(false);
    }
  };

  // ── Web: Stripe checkout ───────────────────────────────────────────
  const handleCheckout = async (priceId: string) => {
    setLoadingPrice(priceId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      const res = await supabase.functions.invoke("create-checkout", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { priceId },
      });
      if (res.error) throw res.error;
      if (!res.data?.url) throw new Error("Payment link unavailable");
      window.location.assign(res.data.url);
    } catch (e: unknown) {
      toast({ title: "Error", description: errorMessage(e) || "Failed to start checkout", variant: "destructive" });
    } finally {
      setLoadingPrice(null);
    }
  };

  // ── Web: Stripe customer portal ────────────────────────────────────
  const handleManage = async () => {
    setPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await supabase.functions.invoke("customer-portal", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.error) throw res.error;
      if (!res.data?.url) throw new Error("Payment link unavailable");
      window.location.assign(res.data.url);
    } catch (e: unknown) {
      toast({ title: "Error", description: errorMessage(e) || "Failed to open portal", variant: "destructive" });
    } finally {
      setPortalLoading(false);
    }
  };

 return {loadingPrice,portalLoading,restoring,handleNativePaywall,handleRestore,handleNativeManage,handleCheckout,handleManage};
}
