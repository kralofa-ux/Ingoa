import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, User, Users, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Culture } from "@/data/names";

const CULTURES: Culture[] = ["NZ Māori", "Cook Islands", "Samoa", "Tonga", "Fiji", "Hawaii", "Niue", "Tahiti"];

const CULTURE_EMOJI: Record<string, string> = {
  "NZ Māori": "🇳🇿",
  "Cook Islands": "🇨🇰",
  "Samoa": "🇼🇸",
  "Tonga": "🇹🇴",
  "Fiji": "🇫🇯",
  "Hawaii": "🌺",
  "Niue": "🇳🇺",
  "Tahiti": "🇵🇫",
};

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"solo" | "couple">("solo");
  const [selectedCultures, setSelectedCultures] = useState<string[]>([]);
  const [genderPref, setGenderPref] = useState<"boy" | "girl" | "both">("both");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  const toggleCulture = (c: string) => {
    setSelectedCultures((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const canProceed = () => {
    if (step === 1) return true; // mode selection always valid
    if (step === 2) return selectedCultures.length > 0;
    if (step === 3) return true; // gender always has a default
    if (step === 4) return true; // names optional
    return true;
  };

  const handleFinish = async () => {
    setSubmitting(true);
    await updateProfile({
      mode,
      selected_cultures: selectedCultures,
      gender_preference: genderPref,
      last_name: lastName,
      middle_name: middleName,
      onboarding_completed: true,
    });
    setSubmitting(false);
    navigate("/browse");
  };

  const nextStep = () => {
    if (step === 4) {
      handleFinish();
    } else {
      setStep((s) => s + 1);
    }
  };

  const steps = [
    // Step 0: Welcome
    <motion.div key="welcome" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="text-center">
      <div className="w-20 h-20 rounded-2xl gradient-ocean flex items-center justify-center mx-auto mb-6 shadow-glow-ocean">
        <Heart className="w-10 h-10 text-primary-foreground" fill="currentColor" />
      </div>
      <h1 className="text-4xl font-display text-foreground mb-3">Kia Ora!</h1>
      <p className="text-muted-foreground font-body text-base mb-2">Welcome to Ingoa</p>
      <p className="text-muted-foreground/70 font-body text-sm max-w-xs mx-auto">
        A simple, modern tool to help families choose and preserve Pacific names for the next generation.
      </p>
    </motion.div>,

    // Step 1: Mode
    <motion.div key="mode" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="text-center">
      <h2 className="text-2xl font-display text-foreground mb-2">How are you using Ingoa?</h2>
      <p className="text-sm text-muted-foreground font-body mb-6">You can change this later in settings</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setMode("solo")}
          className={`p-5 rounded-2xl border-2 transition-all font-body ${
            mode === "solo"
              ? "border-primary bg-primary/5 shadow-glow-ocean"
              : "border-border bg-card hover:border-primary/30"
          }`}
        >
          <User className="w-8 h-8 mx-auto mb-2 text-primary" />
          <span className="font-semibold text-foreground text-sm">Solo</span>
          <p className="text-xs text-muted-foreground mt-1">Browse on your own</p>
        </button>
        <button
          onClick={() => setMode("couple")}
          className={`p-5 rounded-2xl border-2 transition-all font-body ${
            mode === "couple"
              ? "border-primary bg-primary/5 shadow-glow-ocean"
              : "border-border bg-card hover:border-primary/30"
          }`}
        >
          <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
          <span className="font-semibold text-foreground text-sm">Couple</span>
          <p className="text-xs text-muted-foreground mt-1">Match with partner</p>
        </button>
      </div>
    </motion.div>,

    // Step 2: Cultures
    <motion.div key="cultures" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="text-center">
      <h2 className="text-2xl font-display text-foreground mb-2">Choose your cultures</h2>
      <p className="text-sm text-muted-foreground font-body mb-6">Select one or more Pacific cultures</p>
      <div className="grid grid-cols-2 gap-2">
        {CULTURES.map((c) => (
          <button
            key={c}
            onClick={() => toggleCulture(c)}
            className={`p-3 rounded-xl border-2 transition-all font-body text-left flex items-center gap-2 ${
              selectedCultures.includes(c)
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <span className="text-lg">{CULTURE_EMOJI[c]}</span>
            <span className="text-sm font-medium text-foreground">{c}</span>
            {selectedCultures.includes(c) && <Check className="w-4 h-4 text-primary ml-auto" />}
          </button>
        ))}
      </div>
    </motion.div>,

    // Step 3: Gender
    <motion.div key="gender" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="text-center">
      <h2 className="text-2xl font-display text-foreground mb-2">Gender preference</h2>
      <p className="text-sm text-muted-foreground font-body mb-6">Unisex names are always included</p>
      <div className="space-y-2">
        {([["boy", "Boy names"], ["girl", "Girl names"], ["both", "All names"]] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setGenderPref(val)}
            className={`w-full p-4 rounded-xl border-2 transition-all font-body text-sm font-medium ${
              genderPref === val
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/30"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </motion.div>,

    // Step 4: Names (optional)
    <motion.div key="names" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="text-center">
      <h2 className="text-2xl font-display text-foreground mb-2">Name preview</h2>
      <p className="text-sm text-muted-foreground font-body mb-6">
        Add a last or middle name to preview how names look together (optional)
      </p>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Middle name"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-8 bg-primary" : i < step ? "w-4 bg-primary/40" : "w-4 bg-border"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {steps[step]}
        </AnimatePresence>

        {/* Next button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={nextStep}
          disabled={!canProceed() || submitting}
          className="w-full mt-8 py-3 rounded-xl gradient-ocean text-primary-foreground font-body font-semibold text-sm shadow-glow-ocean disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? "Setting up..." : step === 4 ? "Start Exploring" : "Continue"}
          {!submitting && <ArrowRight className="w-4 h-4" />}
        </motion.button>

        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="w-full mt-3 py-2 text-sm text-muted-foreground font-body hover:text-foreground transition-colors"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
