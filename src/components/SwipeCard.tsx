import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { PolynesianName } from "@/data/names";
import { useApp } from "@/context/AppContext";
import { getCultureColor, cultureEmoji } from "@/lib/cultureColors";

interface SwipeCardProps {
  name: PolynesianName;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
}

const genderLabel: Record<string, string> = {
  male: "Tāne",
  female: "Wahine",
  unisex: "Unisex",
};

const SwipeCard = ({ name, onSwipeLeft, onSwipeRight, isTop }: SwipeCardProps) => {
  const { showNamePreview, lastName, middleName } = useApp();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) onSwipeRight();
    else if (info.offset.x < -100) onSwipeLeft();
  };

  const namePreview = showNamePreview
    ? [name.name, middleName, lastName].filter(Boolean).join(" ")
    : null;

  const culture = getCultureColor(name.culture);

  return (
    <motion.div
      className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ x: 300, opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={`h-full rounded-3xl ${culture.bg} overflow-hidden flex flex-col relative shadow-card-hover`}>
        {/* Like/Pass overlays */}
        <motion.div
          className="absolute top-6 right-6 z-20 rounded-2xl border-[3px] border-white px-5 py-2.5 font-display font-extrabold text-white rotate-12 text-2xl"
          style={{ opacity: likeOpacity, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
        >
          LIKE
        </motion.div>
        <motion.div
          className="absolute top-6 left-6 z-20 rounded-2xl border-[3px] border-white/80 px-5 py-2.5 font-display font-extrabold text-white -rotate-12 text-2xl"
          style={{ opacity: passOpacity, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
        >
          PASS
        </motion.div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          {/* Culture badge */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">{cultureEmoji[name.culture]}</span>
            <span className="text-xs font-body font-bold text-white/70 uppercase tracking-[0.2em]">
              {name.culture}
            </span>
          </div>

          {/* Name — hero size */}
          <h2 className="text-6xl md:text-7xl font-display font-extrabold text-white mb-3 text-center leading-none tracking-tight">
            {name.name}
          </h2>

          {/* Name preview */}
          {namePreview && (
            <p className="text-base text-white/60 font-body mb-5 text-center">
              {namePreview}
            </p>
          )}

          {/* Gender pill */}
          <span className="inline-block px-5 py-2 rounded-full text-xs font-body font-bold tracking-widest uppercase mb-6 bg-white/15 text-white backdrop-blur-sm">
            {genderLabel[name.gender] || "Unisex"}
          </span>

          {/* Meaning */}
          <p className="text-lg text-white/80 font-body text-center max-w-[280px] leading-relaxed font-medium">
            {name.meaning}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
