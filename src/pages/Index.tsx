import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Seo from "@/components/Seo";
import logo from "@/assets/logo.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-[#0012ee] flower-bg">
      <Seo
        title="Ingoa — Pacific Baby Names"
        description="Discover meaningful Pacific baby names from Māori, Samoan, Tongan, Fijian, Hawaiian, Niuean and Tahitian cultures. Swipe solo or with your partner."
        path="/"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center relative z-10 max-w-md">
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 flex items-center justify-center mx-auto mb-8">
          <img src={logo} alt="Ingoa" className="w-full h-full object-contain" loading="eager" fetchPriority="high" />
        </motion.div>

        <h1 className="md:text-6xl font-display font-extrabold text-foreground mb-4 uppercase tracking-tight text-8xl">
          Ingoa
        </h1>
        <p className="text-lg text-foreground/70 font-body mb-2">
          For Our Tamariki&nbsp;
        </p>
        <p className="text-sm text-foreground/60 font-body mb-10 max-w-sm mx-auto">
          Discover meaningful Pacific baby names from Māori, Samoan, Tongan,
          Fijian, Hawaiian, Niuean and Tahitian cultures — each with its
          meaning and origin.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/auth")}
          className="w-full max-w-xs mx-auto py-4 px-8 rounded-full bg-primary text-primary-foreground font-body font-bold text-lg uppercase tracking-wider transition-all">
          
          Get Started
        </motion.button>

        <p className="mt-6 text-xs text-foreground/40 font-body">
          Swipe right to love, left to pass — solo or with your partner
        </p>

      </motion.div>
    </div>);

};

export default Index;