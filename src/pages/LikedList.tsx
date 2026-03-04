import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const LikedList = () => {
  const { likedNames, removeLikedName, mode, currentPartner } = useApp();

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto">
      <h1 className="text-3xl font-display text-foreground mb-1">
        Liked Names
      </h1>
      {mode === "couple" && (
        <p className="text-sm text-muted-foreground font-body mb-4">
          Partner {currentPartner}'s list
        </p>
      )}
      {likedNames.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">💛</p>
          <p className="text-muted-foreground font-body">No liked names yet. Start swiping!</p>
        </div>
      ) : (
        <div className="space-y-3 mt-4">
          {likedNames.map((name, i) => (
            <motion.div
              key={name.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl bg-card shadow-card border border-border"
            >
              <div>
                <h3 className="text-lg font-display text-foreground">{name.name}</h3>
                <p className="text-sm text-muted-foreground font-body">
                  {name.meaning} · {name.culture}
                </p>
              </div>
              <button
                onClick={() => removeLikedName(name.id)}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedList;
