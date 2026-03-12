import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Trash2, Star } from "lucide-react";
import { useState } from "react";
import NameDetail from "@/components/NameDetail";
import { PolynesianName } from "@/data/names";
import { getGenderColor } from "@/lib/genderColors";

const LikedList = () => {
  const { likedNames, removeLikedName, mode, currentPartner } = useApp();
  const [selectedName, setSelectedName] = useState<PolynesianName | null>(null);
  const [favourites, setFavourites] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("ingoa_favourites");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  const [orderedNames, setOrderedNames] = useState<PolynesianName[]>([]);
  const [hasCustomOrder, setHasCustomOrder] = useState(false);

  const displayNames = hasCustomOrder
    ? orderedNames.filter((n) => likedNames.some((l) => l.id === n.id))
    : [...likedNames].sort((a, b) => {
        const aFav = favourites.has(a.id) ? 0 : 1;
        const bFav = favourites.has(b.id) ? 0 : 1;
        return aFav - bFav;
      });

  const handleReorder = (newOrder: PolynesianName[]) => {
    setOrderedNames(newOrder);
    setHasCustomOrder(true);
  };

  const toggleFavourite = (id: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("ingoa_favourites", JSON.stringify([...next]));
      return next;
    });
  };


  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto">
      <h1 className="text-3xl font-display font-extrabold text-foreground mb-1 tracking-tight">Liked Names</h1>
      {mode === "couple" && (
        <p className="text-sm text-muted-foreground font-body mb-4">
          Partner {currentPartner}'s list
        </p>
      )}
      {displayNames.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">💛</p>
          <p className="text-muted-foreground font-body">Start swiping to discover names.</p>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={displayNames}
          onReorder={handleReorder}
          className="space-y-2 mt-4"
        >
          {displayNames.map((name) => {
            const gColor = getGenderColor(name.gender);
            return (
              <Reorder.Item
                key={name.id}
                value={name}
                className="flex items-center justify-between p-4 rounded-2xl bg-card shadow-card border border-border cursor-grab active:cursor-grabbing overflow-hidden relative"
                whileDrag={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}
              >
                {/* Gender accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${gColor.dot}`} />

                <div className="flex items-center gap-3 flex-1 min-w-0 pl-3" onClick={() => setSelectedName(name)}>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-display font-extrabold text-foreground">{name.name}</h3>
                    <p className="text-sm text-muted-foreground font-body truncate">
                      {name.meaning} · {name.culture}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleFavourite(name.id)}
                    className={`p-2 rounded-lg transition-colors ${favourites.has(name.id) ? "text-accent" : "text-muted-foreground hover:text-accent"}`}
                  >
                    <Star className="w-4 h-4" fill={favourites.has(name.id) ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => removeLikedName(name.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}

      <AnimatePresence>
        {selectedName && (
          <NameDetail name={selectedName} onClose={() => setSelectedName(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LikedList;
