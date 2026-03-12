import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, User, Users, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Culture } from "@/data/names";
import { getCultureColor } from "@/lib/cultureColors";
import CultureIcon from "@/components/CultureIcon";

const CULTURES: Culture[] = ["Cook Islands", "Samoa", "Aotearoa", "Tonga", "Fiji", "Hawaii", "Niue", "Tahiti"];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"solo" | "couple">("solo");
  const [selectedCultures, setSelectedCultures] = useState<string[]>([]);
  const [genderPref, setGenderPref] = useState<"male" | "female" | "all">("all");
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
    if (step === 1) return true;
    if (step === 2) return selectedCultures.length > 0;
    if (step === 3) return true;
    if (step === 4) return true;
    return true;
  };

  const handleFinish = async () => {
    setSubmitting(true);
    const hasNamePreview = middleName.trim().length > 0 || lastName.trim().length > 0;
    await updateProfile({
      mode,
      selected_cultures: selectedCultures,
      gender_preference: genderPref,
      last_name: lastName,
      middle_name: middleName,
      onboarding_completed: true,
    });
    if (hasNamePreview) {
      // Handled in AppContext via profile sync
    }
    setSubmitting(false);
    navigate("/browse");
  };

  const nextStep = () => {
    if (step === 4) handleFinish();
    else setStep((s) => s + 1);
  };

  const steps = [
    // Step 0: Welcome — no icon, just text
    <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-center">
      <h1 className="text-5xl font-display font-extrabold text-foreground mb-4 tracking-tight">Kia Orana,</h1>
      <p className="text-muted-foreground font-body text-lg mb-2">Welcome to Ingoa</p>
      <p className="text-muted-foreground/60 font-body text-sm max-w-xs mx-auto leading-relaxed">
        A simple tool to help families choose and preserve Pacific names for the next generation
      </p>
    </motion.div>,

    // Step 1: Mode
    <motion.div key="mode" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-center">
      <h2 className="text-2xl font-display font-extrabold text-foreground mb-2">How are you using Ingoa?</h2>
      <p className="text-sm text-muted-foreground font-body mb-6">You can change this later in settings</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setMode("solo")}
          className={`p-5 rounded-2xl border transition-all font-body ${
            mode === "solo"
              ? "border-primary bg-primary/10 shadow-glow-primary"
              : "border-white/10 bg-white/5 hover:border-white/20"
          }`}
        >
          <User className="w-8 h-8 mx-auto mb-2 text-primary" />
          <span className="font-bold text-foreground text-sm">Solo</span>
          <p className="text-xs text-muted-foreground mt-1">Browse on your own</p>
        </button>
        <button
          onClick={() => setMode("couple")}
          className={`p-5 rounded-2xl border transition-all font-body ${
            mode === "couple"
              ? "border-primary bg-primary/10 shadow-glow-primary"
              : "border-white/10 bg-white/5 hover:border-white/20"
          }`}
        >
          <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
          <span className="font-bold text-foreground text-sm">Couple</span>
          <p className="text-xs text-muted-foreground mt-1">Match with partner</p>
        </button>
      </div>
    </motion.div>,

    // Step 2: Cultures
    <motion.div key="cultures" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-center">
      <h2 className="text-2xl font-display font-extrabold text-foreground mb-2">Choose your cultures</h2>
      <p className="text-sm text-muted-foreground font-body mb-6">Select one or more Pacific cultures</p>
      <div className="grid grid-cols-2 gap-2">
        {CULTURES.map((c) => {
          const color = getCultureColor(c);
          const selected = selectedCultures.includes(c);
          return (
            <button
              key={c}
              onClick={() => toggleCulture(c)}
              className={`p-3.5 rounded-xl border transition-all font-body text-left flex items-center gap-2.5 ${
                selected
                  ? `${color.border} bg-white/10`
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <CultureIcon culture={c} size={20} />
              <span className="text-sm font-semibold flex-1 text-foreground">{c}</span>
              {selected && <Check className="w-4 h-4 text-primary" />}
            </button>
          );
        })}
      </div>
    </motion.div>,

    // Step 3: Gender
    <motion.div key="gender" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-center">
      <h2 className="text-2xl font-display font-extrabold text-foreground mb-2">Gender preference</h2>
      <p className="text-sm text-muted-foreground font-body mb-6">Unisex names are always included</p>
      <div className="space-y-2">
        {([["male", "Male names"], ["female", "Female names"], ["all", "All names"]] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setGenderPref(val)}
            className={`w-full p-4 rounded-xl border transition-all font-body text-sm font-semibold ${
              genderPref === val
                ? "border-primary bg-primary/10 text-foreground shadow-glow-primary"
                : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </motion.div>,

    // Step 4: Names
    <motion.div key="names" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-center">
      <h2 className="text-2xl font-display font-extrabold text-foreground mb-2">Name preview</h2>
      <p className="text-sm text-muted-foreground font-body mb-6">
        Add a last or middle name to preview how names look together (optional)
      </p>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Middle name"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
        />
      </div>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden gradient-deep">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[150px]" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-10 bg-primary shadow-glow-primary" : i < step ? "w-5 bg-primary/40" : "w-5 bg-white/10"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {steps[step]}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={nextStep}
          disabled={!canProceed() || submitting}
          className="w-full mt-8 py-3.5 rounded-xl gradient-primary text-primary-foreground font-body font-bold text-sm shadow-glow-primary disabled:opacity-50 flex items-center justify-center gap-2"
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
