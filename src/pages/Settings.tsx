import NamePreviewSettings from "@/components/NamePreviewSettings";
import { preferenceCultureClasses } from "@/lib/nameData";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { Culture, Gender } from "@/data/names";
import { useState } from "react";
import { Check, LogOut, Trash2, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import PartnerConnect from "@/components/PartnerConnect";
import CultureIcon from "@/components/CultureIcon";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import PageTitle from "@/components/PageTitle";
import { presentCustomerCenter, isNative } from "@/lib/revenuecat";

const cultures: { value: Culture; label: string }[] = [
  { value: "Cook Islands", label: "Cook Islands" },
  { value: "Samoa", label: "Samoa" },
  { value: "Aotearoa", label: "Aotearoa" },
  { value: "Tonga", label: "Tonga" },
  { value: "Fiji", label: "Fiji" },
  { value: "Hawaii", label: "Hawai'i" },
  { value: "Niue", label: "Niue" },
  { value: "Tahiti", label: "Tahiti" },
];


const genderOptions: { value: Gender | "all"; label: string; color: string }[] = [
  { value: "male", label: "Boy", color: "bg-[hsl(var(--gender-male-surface))]" },
  { value: "female", label: "Girl", color: "bg-[hsl(var(--gender-female-surface))]" },
  { value: "all", label: "Both", color: "bg-[hsl(var(--gender-unisex-surface))]" },
];

const Settings = () => {
  const { user, profile, updateProfile, signOut, isSubscribed, subscriptionTier, checkSubscription } = useAuth();
  const {
    cultureFilter, setCultureFilter,
    genderFilter, setGenderFilter,
    showNamePreview, setShowNamePreview,
    lastName, setLastName,
    middleName, setMiddleName,
  } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const saveProfile = async (updates: Parameters<typeof updateProfile>[0]) => {
    const {error}=await updateProfile(updates);
    if(error)throw error;
  };
  const saveError = () => toast({title:"Unable to save",description:"Please try again",variant:"destructive"});
  const toggleCulture = (culture: Culture) => {
    const updated = cultureFilter.includes(culture)
      ? cultureFilter.filter((c) => c !== culture)
      : [...cultureFilter, culture];
    setCultureFilter(updated);
    void saveProfile({ selected_cultures: updated }).catch(saveError);
  };

  const handleGenderChange = (value: Gender | "all") => {
    setGenderFilter(value);
    void saveProfile({ gender_preference: value }).catch(saveError);
  };

  const handleNamePreviewToggle = (checked: boolean) => {
    setShowNamePreview(checked);
  };

  const handleSaveNamePreview = async () => {
    try { await saveProfile({last_name:lastName,middle_name:middleName});toast({title:"Saved",description:"Name preview updated"}); } catch {saveError();}
  };

  const handleSignOut = async () => {
    try { await signOut(); navigate("/"); } catch {toast({title:"Unable to sign out",description:"Please try again",variant:"destructive"});}
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await supabase.functions.invoke("delete-account", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.error) throw res.error;
      await signOut();
      toast({ title: "Account deleted", description: "All your data has been removed" });
      navigate("/", {replace:true});
    } catch {
      toast({ title: "Error", description: "Failed to delete account. Please try again.", variant: "destructive" });
    }
  };

  const handleSendFeedback = async () => {
    if (!feedback.trim() || !user) return;
    const { error } = await supabase.from("feedback").insert({
      user_id: user.id,
      message: feedback.trim(),
    });
    if (error) {
      toast({ title: "Error", description: "Failed to send feedback", variant: "destructive" });
      return;
    }
    toast({ title: "Thank you!", description: "Your feedback has been sent" });
    setFeedback("");
    setShowFeedback(false);
  };

  return (
    <div className="min-h-screen pb-24 px-4 max-w-lg mx-auto bg-[hsl(var(--app-surface))] flower-bg" style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
      {/* Header — text only, no arrow */}
      <PageTitle className="mb-6">Settings</PageTitle>

      <div className="space-y-6">
        {/* Gender Preference */}
        <section>
          <h2 className="text-xs font-body font-bold text-foreground/60 uppercase tracking-widest mb-3">
            Gender Preference
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {genderOptions.map((g) => (
              <Button variant="unstyled"
                key={g.value}
                onClick={() => handleGenderChange(g.value)}
                className={`py-3.5 rounded-full font-body font-extrabold text-sm uppercase tracking-wider transition-all text-foreground ${g.color} ${
                  genderFilter === g.value
                    ? "ring-2 ring-foreground/40 scale-105"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                {g.label}
              </Button>
            ))}
          </div>
        </section>

        {/* Cultures */}
        <section>
          <h2 className="text-xs font-body font-bold text-foreground/60 uppercase tracking-widest mb-3">
            Selected Cultures
          </h2>
          <div className="space-y-2">
            {cultures.map((c, i) => {
              const selected = cultureFilter.includes(c.value);
              return (
                <Button variant="unstyled"
                  key={c.value}
                  onClick={() => toggleCulture(c.value)}
                  
                  className={`${preferenceCultureClasses[c.value]} w-full flex items-center justify-between px-5 py-3.5 rounded-full font-body text-sm font-extrabold uppercase tracking-wider transition-all text-foreground ${
                    selected ? "ring-2 ring-foreground/40" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <CultureIcon culture={c.value} size={20} />
                    {c.label}
                  </span>
                  {selected && <Check className="w-4 h-4 text-foreground" />}
                </Button>
              );
            })}
          </div>
          <p className="text-xs text-foreground/50 font-body mt-2">
            {cultureFilter.length === 0 ? "All cultures shown" : `${cultureFilter.length} selected`}
          </p>
        </section>

        {/* Partner Connection */}
        <section>
          <h2 className="text-xs font-body font-bold text-foreground/60 uppercase tracking-widest mb-3">
            Couple Mode
          </h2>
          <PartnerConnect />
        </section>

        <NamePreviewSettings onSave={handleSaveNamePreview} />

        {/* Subscription Status */}
        {isSubscribed ? (
          <div className="frosted-pill rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body font-bold text-foreground uppercase tracking-wider">
                ✨ Premium ({subscriptionTier === "lifetime" ? "Lifetime" : "Monthly"})
              </span>
              <span className="text-[10px] font-body font-bold text-[hsl(var(--accent))] uppercase tracking-wider bg-[hsl(var(--accent))]/20 rounded-full px-2.5 py-1">Active</span>
            </div>
            <Button variant="unstyled"
              onClick={async () => {
                if (isNative()) {
                  try { await presentCustomerCenter(); } catch { toast({title:"Unable to open plan",description:"Please try again",variant:"destructive"}); }
                } else {
                  navigate("/subscribe");
                }
              }}
              className="w-full py-3 rounded-full frosted-pill text-foreground text-sm font-body font-bold uppercase tracking-wider hover:bg-foreground/10 transition-all"
            >
              Manage Plan
            </Button>
          </div>
        ) : (
          <Button variant="unstyled"
            onClick={async () => {
              if (isNative()) {
                try {
                  const { presentPaywall: showPaywall } = await import("@/lib/revenuecat");
                  const { purchased, restored } = await showPaywall();
                  if (purchased || restored) await checkSubscription();
                } catch { toast({title:"Unable to open purchase",description:"Please try again",variant:"destructive"}); }
              } else {
                navigate("/subscribe");
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-primary text-foreground text-sm font-body font-extrabold uppercase tracking-wider hover:bg-primary/80 active:scale-[0.98] transition-all"
          >
            ✨ Upgrade to Premium
          </Button>
        )}


        <section className="text-center">
          <Button variant="unstyled"
            onClick={() => setShowFeedback(!showFeedback)}
            className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-primary text-foreground font-body font-extrabold text-sm uppercase tracking-wider transition-all ${
              showFeedback ? "ring-2 ring-foreground/40" : "hover:bg-primary/80"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Send Feedback
          </Button>
          {showFeedback && (
            <div className="mt-2 space-y-3">
              <textarea
                placeholder="Tell us what you think, report issues, or suggest names..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl frosted-pill text-foreground text-sm font-body border-0 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none placeholder:text-foreground/40"
              />
              <Button variant="unstyled"
                onClick={handleSendFeedback}
                disabled={!feedback.trim()}
                className="w-full py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-body font-bold uppercase tracking-wider hover:bg-primary/80 active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:bg-primary"
              >
                Send
              </Button>
            </div>
          )}
        </section>

        {/* Sign Out */}
        <Button variant="unstyled"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-primary text-foreground text-sm font-body font-extrabold uppercase tracking-wider hover:bg-primary/80 active:scale-[0.98] transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>

        {/* Delete Account */}
        <div>
          {!showDeleteConfirm ? (
            <Button variant="unstyled"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-destructive text-foreground text-sm font-body font-extrabold uppercase tracking-wider hover:bg-destructive/80 active:scale-[0.98] transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          ) : (
            <div className="frosted-pill rounded-2xl p-4 space-y-3 text-center">
              <p className="text-sm font-body text-foreground">
                Are you sure? This will permanently delete all your data.
              </p>
              <div className="flex gap-2">
                <Button variant="unstyled"
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3.5 rounded-full bg-destructive text-destructive-foreground text-sm font-body font-bold uppercase tracking-wider"
                >
                  Delete
                </Button>
                <Button variant="unstyled"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3.5 rounded-full frosted-pill text-foreground text-sm font-body font-bold uppercase tracking-wider"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Legal Links */}
        <div className="flex justify-center gap-6 pt-2">
          <Button variant="unstyled" onClick={() => navigate("/privacy")} className="text-xs text-foreground/50 font-body underline">Privacy Policy</Button>
          <Button variant="unstyled" onClick={() => navigate("/terms")} className="text-xs text-foreground/50 font-body underline">Terms of Service</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
