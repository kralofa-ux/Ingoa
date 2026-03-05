import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

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
          className="w-20 h-20 rounded-2xl gradient-ocean flex items-center justify-center mx-auto mb-8 shadow-glow-ocean"
        >
          <Heart className="w-10 h-10 text-primary-foreground" fill="currentColor" />
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-display text-foreground mb-4">
          Ingoa
        </h1>
        <p className="text-lg text-muted-foreground font-body mb-2">
          Find the perfect Polynesian name for your little one
        </p>
        <p className="text-sm text-muted-foreground/70 font-body mb-10">
          NZ Māori · Cook Islands · Samoa · Tonga · Fiji · Hawai'i · Niue · Tahiti
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/auth")}
          className="w-full max-w-xs mx-auto py-4 px-8 rounded-2xl gradient-ocean text-primary-foreground font-body font-semibold text-lg shadow-glow-ocean hover:shadow-card-hover transition-shadow"
        >
          Get Started
        </motion.button>

        <p className="mt-6 text-xs text-muted-foreground font-body">
          Swipe right to love, left to pass — solo or with your partner
        </p>
      </motion.div>
    </div>
  );
};

export default Index;
