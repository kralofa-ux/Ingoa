import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence, Reorder, useDragControls, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import NameDetail from "@/components/NameDetail";
import { PolynesianName } from "@/data/names";
import { getGenderColor } from "@/lib/genderColors";

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
    <div className="relative overflow-hidden rounded-full">
      {/* Delete background */}
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
          <p className="text-xs text-white/70 font-body mt-0.5">
            {name.culture}
          </p>
        </div>
      </Reorder.Item>
    </div>
  );
};

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
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto">
      <h1 className="text-3xl font-display font-extrabold text-foreground mb-1 tracking-tight uppercase">Liked Names</h1>
      {mode === "couple" && (
        <p className="text-sm text-foreground/60 font-body mb-4">
          Partner {currentPartner}'s list
        </p>
      )}
      {displayNames.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">💛</p>
          <p className="text-foreground/60 font-body">Start swiping to discover names.</p>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={displayNames}
          onReorder={handleReorder}
          className="space-y-2 mt-4"
        >
          {displayNames.map((name) => (
            <SwipeToDeleteItem
              key={name.id}
              name={name}
              onRemove={removeLikedName}
              onSelect={setSelectedName}
            />
          ))}
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
