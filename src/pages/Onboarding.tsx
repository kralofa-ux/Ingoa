import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, User, Users, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Culture } from "@/data/names";
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
    if (step === 2) return selectedCultures.length > 0;
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
      onboarding_completed: true
    });
    setSubmitting(false);
    navigate("/browse");
  };

  const nextStep = () => {
    if (step === 4) handleFinish();else
    setStep((s) => s + 1);
  };

  const steps = [
  // Step 0: Welcome
  <motion.div
    key="welcome"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    className="text-left">
    
      <h1 className="text-6xl font-display font-extrabold text-foreground leading-none tracking-tight uppercase px-[22px] pr-0 pb-0 pl-0 mx-0 my-0">
        ingoa    
 
   
 
  
      
    
    
    </h1>
      <p className="text-foreground/70 font-body text-lg mt-4">
        Helping families choose and preserve Pacific names for the next generation
      </p>
      <p className="text-foreground/50 font-body text-sm mt-2 max-w-xs leading-relaxed">
      </p>
    </motion.div>, // Step 1: Mode
  <motion.div key="mode" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
  className="text-left">
    
      <h2 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight leading-tight mb-6">
        How are you using Ingoa?
      </h2>
      <div className="flex gap-3">
        <motion.button
        whileTap={{ scale: 0.95 }}
        animate={mode === "solo" ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={() => setMode("solo")}
        className={`flex-1 py-4 rounded-full font-body font-extrabold text-sm uppercase tracking-wider transition-colors ${
        mode === "solo" ?
        "bg-[#00cfff] text-white ring-2 ring-white/30" :
        "bg-[#00cfff] text-[#173d84]"}`
        }>
        
          <User className="w-5 h-5 mx-auto mb-1" />
          Solo
        </motion.button>
        <motion.button
        whileTap={{ scale: 0.95 }}
        animate={mode === "couple" ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={() => setMode("couple")}
        className={`flex-1 py-4 rounded-full font-body font-extrabold text-sm uppercase tracking-wider transition-colors ${
        mode === "couple" ?
        "bg-[#0074ff] text-white ring-2 ring-white/30" :
        "bg-[#0074ff] text-[#173d84]"}`
        }>
        
          <Users className="w-5 h-5 mx-auto mb-1" />
          Couple
        </motion.button>
      </div>
    </motion.div>,

  // Step 2: Cultures
  <motion.div
    key="cultures"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    className="text-left">
    
      <h2 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight leading-tight mb-6">
        Select Cultures
      </h2>
      <div className="space-y-2">
        {CULTURES.map((c, index) => {
        const selected = selectedCultures.includes(c);
        const cultureBgColors = [
          "#00DBFF", "#00B1F7", "#0088F0", "#0061DD",
          "#0049BB", "#003199", "#001A77", "#000456"
        ];
        const bgColor = selected ? "#FFFFFF" : cultureBgColors[index] || cultureBgColors[0];
        return (
          <button
            key={c}
            onClick={() => toggleCulture(c)}
            style={{ backgroundColor: bgColor }}
            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-full font-body text-sm font-extrabold uppercase tracking-wider transition-all text-white ${
            selected ? "ring-2 ring-white/40" : "opacity-80 hover:opacity-100"}`
            }>
            
              <span className="flex items-center gap-2.5">
                <CultureIcon culture={c} size={20} />
                {c}
              </span>
              {selected && <Check className="w-4 h-4 text-white" />}
            </button>);

      })}
      </div>
    </motion.div>,

  // Step 3: Gender
  <motion.div
    key="gender"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    className="text-left">
    
      <h2 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight leading-tight mb-6">
        Know the Gender?
      </h2>
      <div className="space-y-3">
        <button
        onClick={() => setGenderPref("male")}
        className={`w-full py-4 rounded-full font-body text-sm font-bold transition-all ${
        genderPref === "male" ?
        "bg-[hsl(200,80%,55%)] text-white" :
        "frosted-pill text-foreground/70 hover:text-foreground"}`
        }>
        
          Boy
        </button>
        <button
        onClick={() => setGenderPref("female")}
        className={`w-full py-4 rounded-full font-body text-sm font-bold transition-all ${
        genderPref === "female" ?
        "bg-[hsl(340,70%,65%)] text-white" :
        "frosted-pill text-foreground/70 hover:text-foreground"}`
        }>
        
          Girl
        </button>
        <button
        onClick={() => setGenderPref("all")}
        className={`w-full py-4 rounded-full font-body text-sm font-bold transition-all ${
        genderPref === "all" ?
        "bg-[hsl(35,90%,55%)] text-white" :
        "frosted-pill text-foreground/70 hover:text-foreground"}`
        }>
        
          Surprise Me
        </button>
      </div>
    </motion.div>,

  // Step 4: Names
  <motion.div
    key="names"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    className="text-left">
    
      <h2 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight leading-tight mb-2">
        Name Preview
      </h2>
      <p className="text-sm text-foreground/50 font-body mb-6">
        Optional — see how names look with a middle or last name
      </p>
      <div className="space-y-3">
        <input
        type="text"
        placeholder="Middle name"
        value={middleName}
        onChange={(e) => setMiddleName(e.target.value)}
        className="w-full px-5 py-3.5 rounded-full frosted-pill text-foreground text-sm font-body placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 border-0" />
      
        <input
        type="text"
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full px-5 py-3.5 rounded-full frosted-pill text-foreground text-sm font-body placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 border-0" />
      
      </div>
    </motion.div>];


  return (
    <div className="min-h-screen px-6 relative overflow-hidden bg-[#0015ff] items-center justify-center flex flex-col">
      <div className="w-full max-w-sm relative z-10">
        {/* Progress dots */}
        <div className="gap-2.5 mb-10 items-center justify-center flex flex-row">
          {[0, 1, 2, 3, 4].map((i) =>
          <div
            key={i}
            className={`rounded-full transition-all ${
            i === step ?
            "w-3 h-3 bg-primary" :
            i < step ?
            "w-2.5 h-2.5 bg-primary/60" :
            "w-2.5 h-2.5 bg-foreground/20"}`
            } />

          )}
        </div>

        <AnimatePresence mode="wait">{steps[step]}</AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={nextStep}
          disabled={!canProceed() || submitting}
          className="w-full mt-8 py-4 rounded-full bg-primary text-primary-foreground font-body font-bold text-sm uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2">
          
          {submitting ? "Setting up..." : step === 4 ? "Start Exploring" : "Continue"}
          {!submitting && <ArrowRight className="w-4 h-4" />}
        </motion.button>

        {step > 0 &&
        <button
          onClick={() => setStep((s) => s - 1)}
          className="w-full mt-3 py-2 text-sm text-foreground/50 font-body hover:text-foreground transition-colors">
          
            Back
          </button>
        }
      </div>
    </div>);

};

export default Onboarding;