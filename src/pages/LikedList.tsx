import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence, Reorder, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import NameDetail from "@/components/NameDetail";
import { PolynesianName } from "@/data/names";
import { getGenderColor } from "@/lib/genderColors";
import PageTitle from "@/components/PageTitle";

const SwipeToDeleteItem = ({
  name,
  onRemove,
  onSelect,
}: {
  name: PolynesianName;
  onRemove: (id: string) => void;
  onSelect: (name: PolynesianName) => void;
}) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, -80, 0], [0.3, 0.8, 1]);
  const bgOpacity = useTransform(x, [-150, -80, 0], [1, 0.5, 0]);
  const gColor = getGenderColor(name.gender);

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (info.offset.x < -100) {
      onRemove(name.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-full"
    >
      <motion.div
        className="absolute inset-0 bg-destructive rounded-full flex items-center justify-end pr-6"
        style={{ opacity: bgOpacity }}
      >
        <span className="text-white font-body font-bold text-sm uppercase tracking-wider">Remove</span>
      </motion.div>

      <Reorder.Item
        key={name.id}
        value={name}
        className={`relative rounded-full cursor-grab active:cursor-grabbing overflow-hidden ${gColor.bg} py-4 px-5`}
        whileDrag={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.2)" }}
        style={{ x, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        onDragEnd={handleDragEnd}
        dragDirectionLock
      >
        <div className="text-center" onClick={() => onSelect(name)}>
          <h3 className="text-lg font-display font-extrabold text-white uppercase tracking-wider">
            {name.name}
          </h3>
          <p className="text-xs text-white/70 font-body mt-0.5">{name.culture}</p>
        </div>
      </Reorder.Item>
    </motion.div>
  );
};

// Pacific wave pattern for empty state
const WavePattern = () => (
  <svg width="200" height="60" viewBox="0 0 200 60" className="mx-auto opacity-20 mb-6">
    <path d="M0 30 Q25 10 50 30 T100 30 T150 30 T200 30" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground" />
    <path d="M0 40 Q25 20 50 40 T100 40 T150 40 T200 40" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground" />
    <path d="M0 50 Q25 30 50 50 T100 50 T150 50 T200 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground" />
  </svg>
);

const LikedList = () => {
  const { likedNames, removeLikedName, mode, currentPartner } = useApp();
  const [selectedName, setSelectedName] = useState<PolynesianName | null>(null);
  const [orderedNames, setOrderedNames] = useState<PolynesianName[]>([]);
  const [hasCustomOrder, setHasCustomOrder] = useState(false);

  const displayNames = hasCustomOrder
    ? orderedNames.filter((n) => likedNames.some((l) => l.id === n.id))
    : [...likedNames];

  const handleReorder = (newOrder: PolynesianName[]) => {
    setOrderedNames(newOrder);
    setHasCustomOrder(true);
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto bg-[#0012ee] flower-bg">
      <PageTitle className="mb-1">Liked Names</PageTitle>
      {mode === "couple" && (
        <p className="text-sm text-foreground/60 font-body mb-4">
          Partner {currentPartner}'s list
        </p>
      )}
      {displayNames.length === 0 ? (
        <div className="text-center py-16">
          <WavePattern />
          <h2 className="text-2xl font-display font-extrabold text-foreground uppercase tracking-tight mb-3">
            No Names Yet
          </h2>
          <p className="text-foreground/60 font-body text-sm max-w-xs mx-auto">
            Start swiping to discover beautiful Pacific names for your little one.
          </p>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={displayNames}
          onReorder={handleReorder}
          className="space-y-2 mt-4"
        >
          <AnimatePresence>
            {displayNames.map((name) => (
              <SwipeToDeleteItem
                key={name.id}
                name={name}
                onRemove={removeLikedName}
                onSelect={setSelectedName}
              />
            ))}
          </AnimatePresence>
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
