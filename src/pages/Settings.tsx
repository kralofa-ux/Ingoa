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

const cultureBgColors = [
  "#00DBFF", "#00B1F7", "#0088F0", "#0061DD",
  "#0055CC", "#003199", "#001A77", "#000456",
];

const genderOptions: { value: Gender | "all"; label: string; color: string }[] = [
  { value: "male", label: "Boy", color: "bg-[hsl(200,80%,50%)]" },
  { value: "female", label: "Girl", color: "bg-[hsl(340,70%,55%)]" },
  { value: "all", label: "Surprise", color: "bg-[hsl(30,85%,55%)]" },
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

  const handleNamePreviewToggle = (checked: boolean) => {
    setShowNamePreview(checked);
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
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto bg-[#0012ee] flower-bg">
      {/* Header — text only, no arrow */}
      <h1 className="text-2xl font-display font-extrabold text-foreground tracking-tight uppercase mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Gender Preference */}
        <section>
          <h2 className="text-xs font-body font-bold text-foreground/60 uppercase tracking-widest mb-3">
            Gender Preference
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {genderOptions.map((g) => (
              <button
                key={g.value}
                onClick={() => handleGenderChange(g.value)}
                className={`py-3.5 rounded-full font-body font-extrabold text-sm uppercase tracking-wider transition-all text-white ${g.color} ${
                  genderFilter === g.value
                    ? "ring-2 ring-white/40 scale-105"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                {g.label}
              </button>
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
              const bgColor = cultureBgColors[i] || cultureBgColors[0];
              return (
                <button
                  key={c.value}
                  onClick={() => toggleCulture(c.value)}
                  style={{ backgroundColor: bgColor }}
                  className={`w-full flex items-center justify-between px-5 py-3.5 rounded-full font-body text-sm font-extrabold uppercase tracking-wider transition-all text-white ${
                    selected ? "ring-2 ring-white/40" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <CultureIcon culture={c.value} size={20} />
                    {c.label}
                  </span>
                  {selected && <Check className="w-4 h-4 text-white" />}
                </button>
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

        {/* Name Preview — toggle switch */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-body font-bold text-foreground/60 uppercase tracking-widest">
              Name Preview
            </h2>
            <Switch checked={showNamePreview} onCheckedChange={handleNamePreviewToggle} />
          </div>
          <AnimatePresence initial={false}>
            {showNamePreview && (
              <motion.div
                key="name-preview-fields"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Middle name (optional)"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-full frosted-pill text-foreground text-sm font-body border-0 focus:outline-none focus:ring-2 focus:ring-foreground/20 placeholder:text-foreground/40"
                  />
                  <input
                    type="text"
                    placeholder="Last name (optional)"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-full frosted-pill text-foreground text-sm font-body border-0 focus:outline-none focus:ring-2 focus:ring-foreground/20 placeholder:text-foreground/40"
                  />
                  <button
                    onClick={handleSaveNamePreview}
                    className="w-full py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-body font-bold uppercase tracking-wider hover:bg-primary/80 active:scale-[0.98] transition-all"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Upgrade to Premium */}
        <button
          onClick={() => navigate("/subscribe")}
          className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-primary text-white text-sm font-body font-extrabold uppercase tracking-wider hover:bg-primary/80 active:scale-[0.98] transition-all"
        >
          ✨ Upgrade to Premium
        </button>


        <section className="text-center">
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-primary text-white font-body font-extrabold text-sm uppercase tracking-wider transition-all ${
              showFeedback ? "ring-2 ring-white/40" : "hover:bg-primary/80"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Send Feedback
          </button>
          {showFeedback && (
            <div className="mt-2 space-y-3">
              <textarea
                placeholder="Tell us what you think, report issues, or suggest names..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl frosted-pill text-foreground text-sm font-body border-0 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none placeholder:text-foreground/40"
              />
              <button
                onClick={handleSendFeedback}
                disabled={!feedback.trim()}
                className="w-full py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-body font-bold uppercase tracking-wider hover:bg-primary/80 active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:bg-primary"
              >
                Send
              </button>
            </div>
          )}
        </section>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-primary text-white text-sm font-body font-extrabold uppercase tracking-wider hover:bg-primary/80 active:scale-[0.98] transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>

        {/* Delete Account */}
        <div>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-destructive text-white text-sm font-body font-extrabold uppercase tracking-wider hover:bg-destructive/80 active:scale-[0.98] transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          ) : (
            <div className="frosted-pill rounded-2xl p-4 space-y-3 text-center">
              <p className="text-sm font-body text-foreground">
                Are you sure? This will permanently delete all your data.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3.5 rounded-full bg-destructive text-destructive-foreground text-sm font-body font-bold uppercase tracking-wider"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3.5 rounded-full frosted-pill text-foreground text-sm font-body font-bold uppercase tracking-wider"
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
