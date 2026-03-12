import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { Culture, Gender } from "@/data/names";
import { useState } from "react";
import { ArrowLeft, Check, ChevronRight, LogOut, Trash2, MessageSquare } from "lucide-react";
import PartnerConnect from "@/components/PartnerConnect";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { getCultureColor, cultureEmoji } from "@/lib/cultureColors";

const cultures: { value: Culture; label: string }[] = [
  { value: "Cook Islands", label: "Cook Islands" },
  { value: "Samoa", label: "Samoa" },
  { value: "NZ Māori", label: "NZ Māori" },
  { value: "Tonga", label: "Tonga" },
  { value: "Fiji", label: "Fiji" },
  { value: "Hawaii", label: "Hawai'i" },
  { value: "Niue", label: "Niue" },
  { value: "Tahiti", label: "Tahiti" },
];

const genderOptions: { value: Gender | "all"; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "all", label: "Both" },
];

const Settings = () => {
  const { user, profile, updateProfile, signOut } = useAuth();
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

  const toggleCulture = (culture: Culture) => {
    const updated = cultureFilter.includes(culture)
      ? cultureFilter.filter((c) => c !== culture)
      : [...cultureFilter, culture];
    setCultureFilter(updated);
    updateProfile({ selected_cultures: updated });
  };

  const handleGenderChange = (value: Gender | "all") => {
    setGenderFilter(value);
    updateProfile({ gender_preference: value === "all" ? "all" : value });
  };

  const handleNamePreviewToggle = () => {
    setShowNamePreview(!showNamePreview);
  };

  const handleSaveNamePreview = () => {
    updateProfile({ last_name: lastName, middle_name: middleName });
    toast({ title: "Saved", description: "Name preview updated" });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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
      toast({ title: "Account deleted", description: "All your data has been removed" });
      navigate("/");
    } catch {
      toast({ title: "Error", description: "Failed to delete account. Please try again.", variant: "destructive" });
    }
  };

  const handleSendFeedback = () => {
    if (!feedback.trim()) return;
    toast({ title: "Thank you!", description: "Your feedback has been sent" });
    setFeedback("");
    setShowFeedback(false);
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-display font-extrabold text-foreground tracking-tight">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Gender Preference */}
        <section>
          <h2 className="text-xs font-body font-bold text-muted-foreground uppercase tracking-widest mb-3">
            Gender Preference
          </h2>
          <div className="flex gap-2">
            {genderOptions.map((g) => (
              <button
                key={g.value}
                onClick={() => handleGenderChange(g.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-body font-semibold transition-all ${
                  genderFilter === g.value
                    ? "bg-primary text-primary-foreground shadow-glow-primary"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </section>

        {/* Cultures */}
        <section>
          <h2 className="text-xs font-body font-bold text-muted-foreground uppercase tracking-widest mb-3">
            Selected Cultures
          </h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {cultures.map((c, i) => {
              const selected = cultureFilter.includes(c.value);
              const color = getCultureColor(c.value);
              return (
                <button
                  key={c.value}
                  onClick={() => toggleCulture(c.value)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-body transition-colors ${
                    i < cultures.length - 1 ? "border-b border-border" : ""
                  } ${selected ? "text-primary" : "text-foreground"}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                    {cultureEmoji[c.value]} {c.label}
                  </span>
                  {selected && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground font-body mt-2">
            {cultureFilter.length === 0 ? "All cultures shown" : `${cultureFilter.length} selected`}
          </p>
        </section>

        {/* Partner Connection */}
        <section>
          <h2 className="text-xs font-body font-bold text-muted-foreground uppercase tracking-widest mb-3">
            Couple Mode
          </h2>
          <PartnerConnect />
        </section>

        {/* Name Preview */}
        <section>
          <h2 className="text-xs font-body font-bold text-muted-foreground uppercase tracking-widest mb-3">
            Name Preview
          </h2>
          <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-foreground">Show full name preview</span>
              <button
                onClick={handleNamePreviewToggle}
                className={`w-10 h-6 rounded-full transition-colors ${
                  showNamePreview ? "bg-primary" : "bg-secondary"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-foreground transition-transform mx-1 ${
                    showNamePreview ? "translate-x-4" : ""
                  }`}
                />
              </button>
            </div>
            {showNamePreview && (
              <>
                <input
                  type="text"
                  placeholder="Middle name (optional)"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm font-body border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="text"
                  placeholder="Last name (optional)"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm font-body border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={handleSaveNamePreview}
                  className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-body font-semibold"
                >
                  Save
                </button>
              </>
            )}
          </div>
        </section>

        {/* Send Feedback */}
        <section>
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-card rounded-2xl border border-border text-sm font-body text-foreground"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              Send Feedback
            </span>
            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showFeedback ? "rotate-90" : ""}`} />
          </button>
          {showFeedback && (
            <div className="mt-2 bg-card rounded-2xl border border-border p-4 space-y-3">
              <textarea
                placeholder="Tell us what you think, report issues, or suggest names..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm font-body border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <button
                onClick={handleSendFeedback}
                disabled={!feedback.trim()}
                className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-body font-semibold disabled:opacity-50"
              >
                Send
              </button>
            </div>
          )}
        </section>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-card rounded-2xl border border-border text-sm font-body text-foreground hover:bg-secondary transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>

        {/* Delete Account */}
        <div>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border border-destructive/30 text-sm font-body text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          ) : (
            <div className="bg-card rounded-2xl border border-destructive/30 p-4 space-y-3 text-center">
              <p className="text-sm font-body text-foreground">
                Are you sure? This will permanently delete all your data.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-body font-semibold"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 rounded-xl bg-secondary text-foreground text-sm font-body font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
