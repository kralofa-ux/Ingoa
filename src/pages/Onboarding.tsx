import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft as ArrowLeftIcon, User, Users, Check, RotateCcw, Crown, Sparkles } from "lucide-react";
import swipeRightIcon from "@/assets/nav-swipe-right.svg";
import passIcon from "@/assets/nav-pass.svg";
import undoIcon from "@/assets/undo-swipe.svg";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Culture } from "@/data/names";
import CultureIcon from "@/components/CultureIcon";
import PartnerConnect from "@/components/PartnerConnect";

const CULTURES: Culture[] = ["Cook Islands", "Samoa", "Aotearoa", "Tonga", "Fiji", "Hawaii", "Niue", "Tahiti"];

const cultureBgColors = [
  "#00DBFF", "#00B1F7", "#0088F0", "#0061DD",
  "#0055CC", "#003199", "#001A77", "#000456",
];

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

  // Dynamic steps based on mode
  // 0: Welcome, 1: Mode, 2?: Partner (couple only), 3: Cultures, 4: Gender, 5: Tutorial, 6: Names, 7: Subscription
  const buildStepKeys = () => {
    const keys = ["welcome", "mode"];
    if (mode === "couple") keys.push("partner");
    keys.push("cultures", "gender", "tutorial", "names", "subscription");
    return keys;
  };

  const stepKeys = buildStepKeys();
  const totalSteps = stepKeys.length;
  const currentKey = stepKeys[step] || "welcome";

  const canProceed = () => {
    if (currentKey === "cultures") return selectedCultures.length > 0;
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
    if (step === totalSteps - 1) handleFinish();
    else setStep((s) => s + 1);
  };

  const isLastStep = step === totalSteps - 1;

  const stepContent: Record<string, React.ReactNode> = {
    welcome: (
      <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-left">
        <h1 className="text-6xl font-display font-extrabold text-foreground leading-none tracking-tight uppercase">
          ingoa
        </h1>
        <p className="text-foreground/70 font-body text-lg mt-4">
          Helping families choose and preserve Pacific names for the next generation
        </p>
      </motion.div>
    ),

    mode: (
      <motion.div key="mode" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-left">
        <h2 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight leading-tight mb-6">
          How are you using Ingoa?
        </h2>
        <div className="flex gap-3">
          <motion.button whileTap={{ scale: 0.95 }} animate={mode === "solo" ? { scale: [1, 1.05, 1] } : { scale: 1 }} transition={{ duration: 0.3 }} onClick={() => setMode("solo")}
            className={`flex-1 py-4 rounded-full font-body font-extrabold text-sm uppercase tracking-wider transition-all ${
              mode === "solo" ? "bg-[#00cfff] text-white ring-4 ring-white/60 shadow-lg scale-105" : "bg-[#00cfff]/40 text-white/60"
            }`}>
            <User className="w-5 h-5 mx-auto mb-1" />
            Solo
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} animate={mode === "couple" ? { scale: [1, 1.05, 1] } : { scale: 1 }} transition={{ duration: 0.3 }} onClick={() => setMode("couple")}
            className={`flex-1 py-4 rounded-full font-body font-extrabold text-sm uppercase tracking-wider transition-all ${
              mode === "couple" ? "bg-[#0074ff] text-white ring-4 ring-white/60 shadow-lg scale-105" : "bg-[#0074ff]/40 text-white/60"
            }`}>
            <Users className="w-5 h-5 mx-auto mb-1" />
            Couple
          </motion.button>
        </div>
      </motion.div>
    ),

    partner: (
      <motion.div key="partner" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-left">
        <h2 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight leading-tight mb-6">
          Connect Partner
        </h2>
        <p className="text-sm text-foreground/50 font-body mb-4">
          Generate a code to share, or enter your partner's code
        </p>
        <PartnerConnect />
      </motion.div>
    ),

    cultures: (
      <motion.div key="cultures" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-left">
        <h2 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight leading-tight mb-6">
          Select Cultures
        </h2>
        <div className="space-y-2">
          {CULTURES.map((c, index) => {
            const selected = selectedCultures.includes(c);
            const bgColor = cultureBgColors[index] || cultureBgColors[0];
            return (
              <button key={c} onClick={() => toggleCulture(c)} style={{ backgroundColor: bgColor }}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-full font-body text-sm font-extrabold uppercase tracking-wider transition-all text-white ${
                  selected ? "ring-2 ring-white/40" : "opacity-80 hover:opacity-100"
                }`}>
                <span className="flex items-center gap-2.5">
                  <CultureIcon culture={c} size={20} />
                  {c}
                </span>
                {selected && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>
      </motion.div>
    ),

    gender: (
      <motion.div key="gender" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-left">
        <h2 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight leading-tight mb-6">
          Know the Gender?
        </h2>
        <div className="space-y-3">
          <button onClick={() => setGenderPref("male")}
            className={`w-full py-4 rounded-full font-body text-sm font-extrabold uppercase tracking-wider transition-all text-white bg-[hsl(200,80%,50%)] ${
              genderPref === "male" ? "ring-4 ring-white/60 shadow-lg scale-105" : ""
            }`}>Boy</button>
          <button onClick={() => setGenderPref("female")}
            className={`w-full py-4 rounded-full font-body text-sm font-extrabold uppercase tracking-wider transition-all text-white bg-[hsl(340,70%,55%)] ${
              genderPref === "female" ? "ring-4 ring-white/60 shadow-lg scale-105" : ""
            }`}>Girl</button>
          <button onClick={() => setGenderPref("all")}
            className={`w-full py-4 rounded-full font-body text-sm font-extrabold uppercase tracking-wider transition-all text-white bg-[hsl(30,85%,55%)] ${
              genderPref === "all" ? "ring-4 ring-white/60 shadow-lg scale-105" : ""
            }`}>Both</button>
        </div>
      </motion.div>
    ),

    tutorial: (
      <motion.div key="tutorial" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-left">
        <h2 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight leading-tight mb-8">
          How It Works
        </h2>
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#00DBFF] flex items-center justify-center shrink-0">
              <img src={swipeRightIcon} alt="Swipe right" className="w-7 h-7 invert" />
            </div>
            <div>
              <p className="font-body font-extrabold text-white text-sm uppercase tracking-wider">Swipe Right</p>
              <p className="font-body text-white/60 text-xs mt-0.5">Love the name — add it to your list</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#0074ff] flex items-center justify-center shrink-0">
              <img src={passIcon} alt="Pass" className="w-7 h-7 invert" />
            </div>
            <div>
              <p className="font-body font-extrabold text-white text-sm uppercase tracking-wider">Swipe Left</p>
              <p className="font-body text-white/60 text-xs mt-0.5">Pass — you won't see it again</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#003199] flex items-center justify-center shrink-0">
              <RotateCcw className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="font-body font-extrabold text-white text-sm uppercase tracking-wider">Tap Corner</p>
              <p className="font-body text-white/60 text-xs mt-0.5">Undo your last swipe</p>
            </div>
          </div>
        </div>
      </motion.div>
    ),

    names: (
      <motion.div key="names" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-left">
        <h2 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight leading-tight mb-2">
          See How It Looks
        </h2>
        <p className="text-sm text-foreground/50 font-body mb-6">
          Optional — see how names look with a middle or last name
        </p>
        <div className="space-y-3">
          <input type="text" placeholder="Middle name" value={middleName} onChange={(e) => setMiddleName(e.target.value)}
            className="w-full px-5 py-3.5 rounded-full frosted-pill text-foreground text-sm font-body placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 border-0" />
          <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)}
            className="w-full px-5 py-3.5 rounded-full frosted-pill text-foreground text-sm font-body placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 border-0" />
        </div>
      </motion.div>
    ),

    subscription: (
      <motion.div key="subscription" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-left">
        <h2 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight leading-tight mb-6">
          Choose Your Plan
        </h2>

        {/* Free tier */}
        <div className="frosted-pill rounded-2xl p-5 mb-3">
          <h3 className="font-display font-extrabold text-foreground text-lg uppercase tracking-wide mb-3">Free</h3>
          <ul className="space-y-2 text-sm font-body text-foreground/70">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-foreground/50 shrink-0" /> 20 swipes per day</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-foreground/50 shrink-0" /> Save liked names</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-foreground/50 shrink-0" /> Basic name details</li>
          </ul>
        </div>

        {/* Premium tier */}
        <div className="rounded-2xl p-5 bg-primary/20 border border-primary/30 relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display font-extrabold text-foreground text-lg uppercase tracking-wide mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Premium
          </h3>
          <ul className="space-y-2 text-sm font-body text-foreground/70">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Unlimited swipes</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Couple mode</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Full name catalogue</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Name preview & sharing</li>
          </ul>
          <button className="w-full mt-4 py-3 rounded-full bg-primary text-primary-foreground text-sm font-body font-bold uppercase tracking-wider">
            Upgrade
          </button>
        </div>
      </motion.div>
    ),
  };

  return (
    <div className="min-h-screen px-6 relative overflow-hidden bg-[#0015ff] items-center justify-center flex flex-col">
      <div className="w-full max-w-sm relative z-10 flex flex-col flex-1 justify-center pb-20">
        <AnimatePresence mode="wait">{stepContent[currentKey]}</AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={nextStep}
          disabled={!canProceed() || submitting}
          className="w-full mt-8 py-4 rounded-full bg-primary text-primary-foreground font-body font-bold text-sm uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? "Setting up..." : isLastStep ? "Start Exploring" : currentKey === "subscription" ? "Continue Free" : "Continue"}
          {!submitting && <ArrowRight className="w-4 h-4" />}
        </motion.button>

        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="w-full mt-3 py-2 text-sm text-foreground/50 font-body hover:text-foreground transition-colors"
          >
            Back
          </button>
        )}
      </div>

      {/* Progress dots at bottom */}
      <div className="absolute bottom-8 left-0 right-0 flex gap-2.5 items-center justify-center">
        {stepKeys.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all ${
              i === step ? "w-3 h-3 bg-primary" : i < step ? "w-2.5 h-2.5 bg-primary/60" : "w-2.5 h-2.5 bg-foreground/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
