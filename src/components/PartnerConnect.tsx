import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Copy, Check, Link2, Unlink, Loader2 } from "lucide-react";
import { usePartner } from "@/hooks/usePartner";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const PartnerConnect = () => {
  const { status, loading, code, generateCode, joinCode, disconnect } = usePartner();
  const { refreshProfile } = useAuth();
  const { toast } = useToast();
  const [inputCode, setInputCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [joining, setJoining] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [mode, setMode] = useState<"choose" | "generate" | "enter">("choose");

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateCode();
      setMode("generate");
    } catch {
      toast({ title: "Error", description: "Failed to generate code", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = async () => {
    if (inputCode.length !== 6) return;
    setJoining(true);
    try {
      const data = await joinCode(inputCode);
      await refreshProfile();
      toast({
        title: "Connected! 🎉",
        description: `You're now matched with ${data.partner_name}`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to join",
        variant: "destructive",
      });
    } finally {
      setJoining(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await disconnect();
      await refreshProfile();
      toast({ title: "Disconnected", description: "Partner connection removed" });
      setShowDisconnect(false);
      setMode("choose");
    } catch {
      toast({ title: "Error", description: "Failed to disconnect", variant: "destructive" });
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="frosted-pill rounded-2xl p-6 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-foreground/50" />
      </div>
    );
  }

  // Connected state
  if (status.connected) {
    return (
      <div className="frosted-pill rounded-2xl overflow-hidden">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-body font-semibold text-foreground">
              Connected with {status.partner_name}
            </p>
            <p className="text-xs text-foreground/50 font-body">
              Couple mode active — matches appear when you both like a name
            </p>
          </div>
        </div>
        {!showDisconnect ? (
          <button
            onClick={() => setShowDisconnect(true)}
            className="w-full px-4 py-3 border-t border-foreground/10 text-sm font-body text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
          >
            <Unlink className="w-4 h-4" />
            Disconnect Partner
          </button>
        ) : (
          <div className="p-4 border-t border-foreground/10 space-y-3">
            <p className="text-sm font-body text-foreground text-center">
              Match history will be lost. Reconnecting with the same partner is free.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="flex-1 py-2.5 rounded-full bg-destructive text-destructive-foreground text-sm font-body font-medium disabled:opacity-50"
              >
                {disconnecting ? "..." : "Disconnect"}
              </button>
              <button
                onClick={() => setShowDisconnect(false)}
                className="flex-1 py-2.5 rounded-full frosted-pill text-foreground text-sm font-body font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not connected
  return (
    <div className="frosted-pill rounded-2xl p-4 space-y-4">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-3">
          <Users className="w-6 h-6 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-display font-extrabold text-foreground">Connect with Partner</h3>
        <p className="text-xs text-foreground/50 font-body mt-1">
          Share a code to start matching names together
        </p>
      </div>

      <AnimatePresence mode="wait">
        {mode === "choose" && (
          <motion.div
            key="choose"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground text-sm font-body font-bold uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
              Generate Invite Code
            </button>
            <button
              onClick={() => setMode("enter")}
              className="w-full py-3 rounded-full bg-primary/60 text-white text-sm font-body font-bold uppercase tracking-wider"
            >
              Enter Partner's Code
            </button>
          </motion.div>
        )}

        {mode === "generate" && code && (
          <motion.div
            key="generate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-3"
          >
            <p className="text-xs text-foreground/50 font-body">Share this code with your partner</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-display tracking-[0.3em] text-foreground">{code}</span>
              <button
                onClick={handleCopy}
                className="w-8 h-8 rounded-full frosted-pill flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-foreground/50 font-body">Expires in 24 hours</p>
            <button
              onClick={() => { setMode("choose"); }}
              className="text-xs text-foreground/50 font-body underline"
            >
              Back
            </button>
          </motion.div>
        )}

        {mode === "enter" && (
          <motion.div
            key="enter"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-xs font-body font-bold text-foreground/60 uppercase tracking-widest pl-1">
                Partner Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setJoinError("");
                }}
                className={`w-full px-5 py-3.5 rounded-full bg-[hsl(220,60%,88%)]/20 text-foreground text-center text-2xl font-display tracking-[0.3em] border-0 focus:outline-none focus:ring-2 focus:ring-foreground/20 placeholder:text-foreground/30 transition-all ${
                  joinError ? "ring-2 ring-destructive/60" : ""
                }`}
              />
              <AnimatePresence>
                {joinError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs font-body text-destructive pl-1"
                  >
                    {joinError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={handleJoin}
              disabled={inputCode.length !== 6 || joining}
              className="w-full py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-body font-bold uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {joining ? "Connecting..." : "Connect"}
            </button>
            <button
              onClick={() => { setMode("choose"); setInputCode(""); setJoinError(""); }}
              className="w-full text-xs text-foreground/50 font-body underline text-center"
            >
              Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PartnerConnect;
