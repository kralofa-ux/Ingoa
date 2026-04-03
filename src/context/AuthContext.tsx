import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  selected_cultures: string[];
  gender_preference: string;
  last_name: string;
  middle_name: string;
  mode: string;
  subscription_status: string;
  onboarding_completed: boolean;
}

interface SubscriptionState {
  isSubscribed: boolean;
  subscriptionTier: "free" | "monthly" | "lifetime";
  subscriptionEnd: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isSubscribed: boolean;
  subscriptionTier: "free" | "monthly" | "lifetime";
  subscriptionEnd: string | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [subState, setSubState] = useState<SubscriptionState>({
    isSubscribed: false,
    subscriptionTier: "free",
    subscriptionEnd: null,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    setProfile(data);
  };

  const checkSubscription = useCallback(async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (!currentSession) return;
    try {
      const res = await supabase.functions.invoke("check-subscription", {
        headers: { Authorization: `Bearer ${currentSession.access_token}` },
      });
      if (res.data && !res.error) {
        setSubState({
          isSubscribed: res.data.subscribed ?? false,
          subscriptionTier: res.data.tier ?? "free",
          subscriptionEnd: res.data.subscription_end ?? null,
        });
      }
    } catch (e) {
      console.error("check-subscription error", e);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => fetchProfile(session.user.id), 0);
          setTimeout(() => checkSubscription(), 100);
        } else {
          setProfile(null);
          setSubState({ isSubscribed: false, subscriptionTier: "free", subscriptionEnd: null });
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        checkSubscription();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [checkSubscription]);

  // Auto-refresh subscription every 60s while logged in
  useEffect(() => {
    if (user) {
      intervalRef.current = setInterval(checkSubscription, 60_000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user, checkSubscription]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data?.user && !data.user.email_confirmed_at) {
      await supabase.auth.signOut();
      return { error: { message: "Please verify your email address before signing in. Check your inbox for the confirmation link." } };
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSubState({ isSubscribed: false, subscriptionTier: "free", subscriptionEnd: null });
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: "Not authenticated" };
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);
    if (!error) await fetchProfile(user.id);
    return { error };
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user, session, profile, loading,
        isSubscribed: subState.isSubscribed,
        subscriptionTier: subState.subscriptionTier,
        subscriptionEnd: subState.subscriptionEnd,
        signUp, signIn, signOut, resetPassword,
        updateProfile, refreshProfile, checkSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
