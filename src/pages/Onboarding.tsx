import OnboardingPlan from "@/components/OnboardingPlan";
import { preferenceCultureClasses } from "@/lib/nameData";
import { Button } from "@/components/ui/button";
import { saveThenNavigate } from "@/lib/profileActions";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft as ArrowLeftIcon, Check, Crown, Sparkles } from "lucide-react";
import modeSoloIcon from "@/assets/mode-solo.svg";
import modeCoupleIcon from "@/assets/mode-couple.svg";
import NavSwipeRightIcon from "@/components/icons/NavSwipeRightIcon";
import NavPassIcon from "@/components/icons/NavPassIcon";
import UndoSwipeIcon from "@/components/icons/UndoSwipeIcon";
import onboardingFlower from "@/assets/onboarding-flower.png.asset.json";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Culture } from "@/data/names";
import CultureIcon from "@/components/CultureIcon";
import PartnerConnect from "@/components/PartnerConnect";

const MotionButton = motion(Button);

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
  const { toast } = useToast();

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

  const finish = async (destination: '/browse' | '/subscribe') => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await saveThenNavigate(()=>updateProfile({mode,selected_cultures:selectedCultures,gender_preference:genderPref,last_name:lastName,middle_name:middleName,onboarding_completed:true}),navigate,destination);
    } catch(error) { toast({title:'Unable to save',description:error && typeof error==='object' && 'message' in error ? String(error.message) : 'Please try again',variant:'destructive'}); }
    finally {setSubmitting(false);}
  };
  const handleFinish = () => finish('/browse');
  const handlePlanTap = () => finish('/subscribe');

  const nextStep = () => {
    if (step === totalSteps - 1) handleFinish();
    else setStep((s) => s + 1);
  };

  const isLastStep = step === totalSteps - 1;

  const stepContent: Record<string, React.ReactNode> = {
    welcome: (
      <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-left">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mb-6">
          <img src={onboardingFlower.url} alt="Ingoa" className="w-full h-full object-contain" loading="eager" decoding="sync" fetchPriority="high" />
        </motion.div>
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
          <MotionButton variant="unstyled" whileTap={{ scale: 0.95 }} animate={mode === "solo" ? { scale: [1, 1.05, 1] } : { scale: 1 }} transition={{ duration: 0.3 }} onClick={() => setMode("solo")}
            className={`flex-1 py-5 rounded-full font-body font-extrabold text-sm uppercase tracking-wider transition-all flex flex-col items-center gap-2 ${
              mode === "solo" ? "bg-[hsl(var(--selection-solo))] text-foreground ring-4 ring-foreground/60 shadow-lg scale-105" : "bg-[hsl(var(--selection-solo))]/40 text-foreground/60"
            }`}>
            <img src={modeSoloIcon} alt="" className="w-7 h-7 invert" />
            Solo
          </MotionButton>
          <MotionButton variant="unstyled" whileTap={{ scale: 0.95 }} animate={mode === "couple" ? { scale: [1, 1.05, 1] } : { scale: 1 }} transition={{ duration: 0.3 }} onClick={() => setMode("couple")}
            className={`flex-1 py-5 rounded-full font-body font-extrabold text-sm uppercase tracking-wider transition-all flex flex-col items-center gap-2 ${
              mode === "couple" ? "bg-[hsl(var(--selection-couple))] text-foreground ring-4 ring-foreground/60 shadow-lg scale-105" : "bg-[hsl(var(--selection-couple))]/40 text-foreground/60"
            }`}>
            <img src={modeCoupleIcon} alt="" className="w-9 h-9 invert" />
            Couple
          </MotionButton>
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
      <motion.div key="cultures" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-left pt-12">
        <h2 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight leading-tight mb-4">
          Select Cultures
        </h2>
        <div className="space-y-2">
          {CULTURES.map((c, index) => {
            const selected = selectedCultures.includes(c);
            return (
              <Button variant="unstyled" key={c} onClick={() => toggleCulture(c)} 
                className={`${preferenceCultureClasses[c]} w-full flex items-center justify-between px-5 py-3.5 rounded-full font-body text-sm font-extrabold uppercase tracking-wider transition-all text-foreground ${
                  selected ? "ring-2 ring-foreground/40" : "opacity-80 hover:opacity-100"
                }`}>
                <span className="flex items-center gap-2.5">
                  <CultureIcon culture={c} size={20} />
                  {c}
                </span>
                {selected && <Check className="w-4 h-4 text-foreground" />}
              </Button>
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
          <Button variant="unstyled" onClick={() => setGenderPref("male")}
            className={`w-full py-4 rounded-full font-body text-sm font-extrabold uppercase tracking-wider transition-all text-foreground bg-[hsl(var(--gender-male-surface))] ${
              genderPref === "male" ? "ring-4 ring-foreground/60 shadow-lg scale-105" : ""
            }`}>Boy</Button>
          <Button variant="unstyled" onClick={() => setGenderPref("female")}
            className={`w-full py-4 rounded-full font-body text-sm font-extrabold uppercase tracking-wider transition-all text-foreground bg-[hsl(var(--gender-female-surface))] ${
              genderPref === "female" ? "ring-4 ring-foreground/60 shadow-lg scale-105" : ""
            }`}>Girl</Button>
          <Button variant="unstyled" onClick={() => setGenderPref("all")}
            className={`w-full py-4 rounded-full font-body text-sm font-extrabold uppercase tracking-wider transition-all text-foreground bg-[hsl(var(--gender-unisex-surface))] ${
              genderPref === "all" ? "ring-4 ring-foreground/60 shadow-lg scale-105" : ""
            }`}>Surprise</Button>
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
            <div className="w-14 h-14 rounded-full bg-[hsl(var(--action-cyan))] flex items-center justify-center shrink-0">
              <NavSwipeRightIcon className="w-7 h-7 text-foreground" />
            </div>
            <div>
              <p className="font-body font-extrabold text-foreground text-sm uppercase tracking-wider">Swipe Right</p>
              <p className="font-body text-foreground/60 text-xs mt-0.5">Love the name — add it to your list</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[hsl(var(--selection-couple))] flex items-center justify-center shrink-0">
              <NavPassIcon className="w-7 h-7 text-foreground" />
            </div>
            <div>
              <p className="font-body font-extrabold text-foreground text-sm uppercase tracking-wider">Swipe Left</p>
              <p className="font-body text-foreground/60 text-xs mt-0.5">Pass — you won't see it again</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[hsl(var(--preference-niue))] flex items-center justify-center shrink-0">
              <UndoSwipeIcon className="w-8 h-8 text-foreground" />
            </div>
            <div>
              <p className="font-body font-extrabold text-foreground text-sm uppercase tracking-wider">Tap Corner</p>
              <p className="font-body text-foreground/60 text-xs mt-0.5">Undo your last swipe</p>
            </div>
          </div>
        </div>
      </motion.div>
    ),

    names: (
      <motion.div key="names" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-left">
        <h2 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight leading-tight mb-6">
          See How It Looks
        </h2>
        <p className="text-sm text-foreground/50 font-body mb-8">
          Optional — see how names look with a middle or last name
        </p>
        <div className="space-y-3">
          <input type="text" placeholder="Middle name" value={middleName} onChange={(e) => setMiddleName(e.target.value)}
            className="w-full px-5 py-3.5 rounded-full bg-[hsl(var(--action-cyan))] text-foreground text-sm font-body font-semibold placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground/30 border-0 uppercase tracking-wider" />
          <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)}
            className="w-full px-5 py-3.5 rounded-full bg-[hsl(var(--preference-aotearoa))] text-foreground text-sm font-body font-semibold placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground/30 border-0 uppercase tracking-wider" />
        </div>
      </motion.div>
    ),

    subscription: (
      <OnboardingPlan onPlan={handlePlanTap} submitting={submitting} />
    ),
  };

  return (
    <div className="min-h-screen px-6 relative overflow-hidden bg-[hsl(var(--app-surface))] flower-bg items-center justify-center flex flex-col">
      <div className="w-full max-w-sm relative z-10 flex flex-col flex-1 justify-center pb-20">
        <AnimatePresence mode="wait">{stepContent[currentKey]}</AnimatePresence>

        <MotionButton variant="unstyled"
          whileTap={{ scale: 0.97 }}
          onClick={nextStep}
          disabled={!canProceed() || submitting}
          className="w-full mt-8 py-4 rounded-full bg-primary text-primary-foreground font-body font-bold text-sm uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? "Setting up..." : isLastStep ? "Start Exploring" : currentKey === "subscription" ? "Continue Free" : "Continue"}
          {!submitting && <ArrowRight className="w-4 h-4" />}
        </MotionButton>

        {step > 0 && (
          <Button variant="unstyled"
            onClick={() => setStep((s) => s - 1)}
            className="w-full mt-3 py-2 text-sm text-foreground/50 font-body hover:text-foreground transition-colors"
          >
            Back
          </Button>
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
