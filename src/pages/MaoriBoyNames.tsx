import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Seo from "@/components/Seo";
import logo from "@/assets/logo.png";

interface NameRow {
  id: string;
  name: string;
  meaning: string | null;
  culture: string | null;
}

const MaoriBoyNames = () => {
  const navigate = useNavigate();

  const { data: names, isLoading } = useQuery({
    queryKey: ["maori-boy-names-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("names")
        .select("id, name, meaning, culture")
        .eq("gender", "male")
        .eq("status", "active")
        .ilike("culture", "%maori%")
        .order("name")
        .limit(24);
      if (error) throw error;
      return (data ?? []) as NameRow[];
    },
  });

  return (
    <div className="min-h-screen bg-[#0012ee] flower-bg px-6 py-12 pb-24">
      <Seo
        title="Māori Boy Names — Ingoa"
        description="Browse meaningful Māori boy names with meanings and origins. Find the perfect ingoa for your tama with Ingoa, the Pacific baby names app."
        path="/maori-boy-names"
      />
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10">
          <img src={logo} alt="Ingoa" className="w-16 h-16 object-contain mx-auto mb-6" loading="eager" />
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-4 tracking-tight">
            Māori Boy Names
          </h1>
          <p className="text-foreground/70 font-body text-base md:text-lg max-w-lg mx-auto">
            A curated selection of Māori names for boys, each with its meaning and
            cultural origin. Ingoa helps you and your partner discover the perfect
            name for your tama — swipe together and find the names you both love.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-white/10 animate-pulse" />
            ))}
          </div>
        ) : names && names.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {names.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.6) }}
                className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-5">
                <h2 className="text-xl font-display font-bold text-foreground mb-1">{n.name}</h2>
                {n.meaning && <p className="text-sm text-foreground/70 font-body">{n.meaning}</p>}
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-foreground/60 font-body mb-12">
            Our full catalogue of Māori boy names is available inside the app.
          </p>
        )}

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/auth")}
            className="py-4 px-10 rounded-full bg-primary text-primary-foreground font-body font-bold text-lg uppercase tracking-wider">
            Explore All Names
          </motion.button>
          <p className="mt-4 text-xs text-foreground/50 font-body">
            Free to start — swipe solo or connect with your partner
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaoriBoyNames;
