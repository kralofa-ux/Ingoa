import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

type View = "login" | "signup" | "forgot";

const Auth = () => {
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast({ title: "Error", description: String(result.error), variant: "destructive" });
      }
      if (result.redirected) return;
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Apple sign-in failed", variant: "destructive" });
    } finally {
      setAppleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (view === "forgot") {
      const { error } = await resetPassword(email);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your email", description: "Password reset link sent." });
        setView("login");
      }
      setSubmitting(false);
      return;
    }

    const action = view === "login" ? signIn : signUp;
    const { error } = await action(email, password);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (view === "signup") {
      toast({ title: "Account created!", description: "Check your email to verify, then log in." });
      setView("login");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-[#0012ee] flower-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <img src={logo} alt="Ingoa" className="w-full h-full object-contain" loading="eager" fetchPriority="high" />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-foreground tracking-tight uppercase">Ingoa</h1>
          <p className="text-sm text-foreground/60 font-body mt-1">
            {view === "login" ? "Welcome back" : view === "signup" ? "Create your account" : "Reset your password"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-full frosted-pill text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 border-0 placeholder:text-foreground/40"
            />
          </div>

          {view !== "forgot" && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-11 pr-4 py-3.5 rounded-full frosted-pill text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 border-0 placeholder:text-foreground/40"
              />
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-body font-bold text-sm uppercase tracking-wider disabled:opacity-50"
          >
            {submitting ? "..." : view === "login" ? "Sign In" : view === "signup" ? "Create Account" : "Send Reset Link"}
          </motion.button>

          {view !== "forgot" && (
            <>
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-foreground/20" />
                <span className="text-xs text-foreground/40 font-body">or</span>
                <div className="flex-1 h-px bg-foreground/20" />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleAppleSignIn}
                disabled={appleLoading}
                className="w-full py-3.5 rounded-full bg-white text-black font-body font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                {appleLoading ? "..." : "Sign in with Apple"}
              </motion.button>
            </>
          )}
        </form>

        <div className="mt-6 text-center space-y-2">
          {view === "login" && (
            <>
              <button onClick={() => setView("forgot")} className="text-xs text-foreground/50 font-body hover:text-foreground transition-colors">
                Forgot password?
              </button>
              <p className="text-xs text-foreground/50 font-body">
                Don't have an account?{" "}
                <button onClick={() => setView("signup")} className="text-foreground font-bold">Sign up</button>
              </p>
            </>
          )}
          {view === "signup" && (
            <p className="text-xs text-foreground/50 font-body">
              Already have an account?{" "}
              <button onClick={() => setView("login")} className="text-foreground font-bold">Sign in</button>
            </p>
          )}
          {view === "forgot" && (
            <button onClick={() => setView("login")} className="text-xs text-foreground font-body flex items-center gap-1 mx-auto">
              <ArrowLeft className="w-3 h-3" /> Back to sign in
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
