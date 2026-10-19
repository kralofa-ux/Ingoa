import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  loginRevenueCat,
  logoutRevenueCat,
  getSubscriptionStatus,
  isNative,
} from "@/lib/revenuecat";
import { unregisterPush } from "@/lib/push";

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
  signUp: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  signIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: { message: string } | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: { message: string } | null }>;
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
  const activeUser = useRef<string | undefined>(user?.id);
  activeUser.current=user?.id;
  const subscriptionRequest=useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    if(activeUser.current===userId)setProfile(data);
  };

  const checkSubscription = useCallback(async () => {
    const version=++subscriptionRequest.current;
    const {data:{session:currentSession}}=await supabase.auth.getSession();
    if(!currentSession)return;
    const id=currentSession.user.id;
    let next: SubscriptionState;
    if(currentSession.user.email?.toLowerCase()==='demo@ingoa.app') next={isSubscribed:true,subscriptionTier:'lifetime',subscriptionEnd:null};
    else if(isNative()) {
      const status=await getSubscriptionStatus();
      next={isSubscribed:status.isSubscribed,subscriptionTier:status.tier,subscriptionEnd:status.expiresDate};
    } else {
      const {data,error}=await supabase.functions.invoke('check-subscription');
      if(error)throw error;
      if(!data || data.error)throw new Error('Unable to verify premium access');
      next={isSubscribed:data.subscribed??false,subscriptionTier:data.tier??'free',subscriptionEnd:data.subscription_end??null};
    }
    if(version===subscriptionRequest.current && activeUser.current===id)setSubState(next);
  },[]);

  useEffect(() => {
    let disposed = false;
    let version = 0;
    let lastUserId: string | null | undefined;
    const hydrate = async (nextSession: Session | null) => {
      const nextId = nextSession?.user.id ?? null;
      setSession(nextSession);
      if (nextId === lastUserId) return;
      lastUserId = nextId;
      const current = ++version;
      activeUser.current=nextId??undefined;subscriptionRequest.current++;
      setLoading(true);setUser(nextSession?.user ?? null);setProfile(null);
      setSubState({isSubscribed:false,subscriptionTier:'free',subscriptionEnd:null});
      try {
        if (nextId) {
          const {data,error}=await supabase.from('profiles').select('*').eq('user_id',nextId).single();
          if (error) throw error;
          if (disposed || current!==version) return;
          if(activeUser.current===nextId)setProfile(data);
          if (isNative()) await loginRevenueCat(nextId);
          if (disposed || current!==version) return;
          await checkSubscription();
        } else if (isNative()) await logoutRevenueCat();
      } catch (error) { console.error('Unable to load account',error); }
      finally { if (!disposed && current===version) setLoading(false); }
    };
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,nextSession)=> {
      setTimeout(()=>{if(!disposed) void hydrate(nextSession);},0);
    });
    void supabase.auth.getSession().then(({data:{session},error})=> {
      if(disposed || lastUserId!==undefined)return;
      if(error)console.error('Unable to restore session',error);
      void hydrate(session);
    });
    return ()=>{disposed=true;version++;subscription.unsubscribe();};
  },[checkSubscription]);

  // Auto-refresh subscription every 60s while logged in
  useEffect(() => {
    if (user) {
      intervalRef.current = setInterval(()=>{void checkSubscription().catch(error=>console.warn("Unable to refresh premium access",error));}, 60_000);
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
    if (isNative()) {
      try { await unregisterPush(); } catch (error) { console.warn("Unable to unregister notifications",error); }
      await logoutRevenueCat();
    }
    const {error}=await supabase.auth.signOut({scope:"local"});
    if(error)throw error;
    activeUser.current=undefined;subscriptionRequest.current++;
    setUser(null);setSession(null);setProfile(null);
    setSubState({ isSubscribed: false, subscriptionTier: "free", subscriptionEnd: null });
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: { message: "Not authenticated" } };
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
