import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Mail, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type View = "login" | "signup" | "forgot";

const Auth = () => {
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-ocean flex items-center justify-center mx-auto mb-4 shadow-glow-ocean">
            <Heart className="w-8 h-8 text-primary-foreground" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-display text-foreground">Ingoa</h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            {view === "login" ? "Welcome back" : view === "signup" ? "Create your account" : "Reset your password"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {view !== "forgot" && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl gradient-ocean text-primary-foreground font-body font-semibold text-sm shadow-glow-ocean disabled:opacity-50"
          >
            {submitting ? "..." : view === "login" ? "Sign In" : view === "signup" ? "Create Account" : "Send Reset Link"}
          </motion.button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {view === "login" && (
            <>
              <button onClick={() => setView("forgot")} className="text-xs text-muted-foreground font-body hover:text-primary transition-colors">
                Forgot password?
              </button>
              <p className="text-xs text-muted-foreground font-body">
                Don't have an account?{" "}
                <button onClick={() => setView("signup")} className="text-primary font-semibold">Sign up</button>
              </p>
            </>
          )}
          {view === "signup" && (
            <p className="text-xs text-muted-foreground font-body">
              Already have an account?{" "}
              <button onClick={() => setView("login")} className="text-primary font-semibold">Sign in</button>
            </p>
          )}
          {view === "forgot" && (
            <button onClick={() => setView("login")} className="text-xs text-primary font-body flex items-center gap-1 mx-auto">
              <ArrowLeft className="w-3 h-3" /> Back to sign in
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
