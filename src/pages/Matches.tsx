import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Matches = () => {
  const { matchedNames } = useApp();

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto">
      <h1 className="text-3xl font-display text-foreground mb-1">
        Matched Names
      </h1>
      <p className="text-sm text-muted-foreground font-body mb-4">
        Names you both loved 💕
      </p>

      {matchedNames.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🤝</p>
          <p className="text-muted-foreground font-body">
            No matches yet. Both partners need to like the same names!
          </p>
        </div>
      ) : (
        <div className="space-y-3 mt-4">
          {matchedNames.map((name, i) => (
            <motion.div
              key={name.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 p-4 rounded-xl gradient-ocean text-primary-foreground shadow-glow-ocean"
            >
              <Heart className="w-5 h-5 flex-shrink-0" fill="currentColor" />
              <div>
                <h3 className="text-lg font-display">{name.name}</h3>
                <p className="text-sm opacity-80 font-body">
                  {name.meaning} · {name.culture}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
