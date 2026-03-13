import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center relative z-10 max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-8"
        >
          <span className="text-4xl">🌊</span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-display font-extrabold text-foreground mb-4 uppercase tracking-tight">
          Ingoa
        </h1>
        <p className="text-lg text-foreground/70 font-body mb-2">
          Discover meaningful Pacific names for your little one
        </p>
        <p className="text-sm text-foreground/40 font-body mb-10">
          Māori · Cook Islands · Samoa · Tonga · Fiji · Hawai'i · Niue · Tahiti
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/auth")}
          className="w-full max-w-xs mx-auto py-4 px-8 rounded-full bg-primary text-primary-foreground font-body font-bold text-lg uppercase tracking-wider transition-all"
        >
          Get Started
        </motion.button>

        <p className="mt-6 text-xs text-foreground/40 font-body">
          Swipe right to love, left to pass — solo or with your partner
        </p>
      </motion.div>
    </div>
  );
};

export default Index;
