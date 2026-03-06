import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { PolynesianName } from "@/data/names";
import { Heart, X } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface SwipeCardProps {
  name: PolynesianName;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
}

const cultureEmoji: Record<string, string> = {
  "NZ Māori": "🇳🇿",
  "Cook Islands": "🇨🇰",
  "Samoa": "🇼🇸",
  "Tonga": "🇹🇴",
  "Fiji": "🇫🇯",
  "Hawaii": "🇺🇸",
  "Niue": "🇳🇺",
  "Tahiti": "🇵🇫",
};

const genderLabel: Record<string, string> = {
  male: "Boy",
  female: "Girl",
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

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? "z-10 cursor-grab active:cursor-grabbing" : "z-0"}`}
      style={{ x: isTop ? x : 0, rotate: isTop ? rotate : 0 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.97, opacity: isTop ? 1 : 0.5 }}
      animate={{ scale: isTop ? 1 : 0.97, opacity: isTop ? 1 : 0.5 }}
      exit={{ x: 300, opacity: 0, transition: { duration: 0.25 } }}
    >
      <div className="h-full rounded-2xl bg-card border border-border overflow-hidden flex flex-col shadow-card">
        {/* Gradient accent strip */}
        <div className="h-1.5 gradient-ocean w-full" />

        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          {/* Like/Pass overlays */}
          {isTop && (
            <>
              <motion.div
                className="absolute top-6 right-6 border-2 border-palm px-3 py-1 font-body font-bold text-palm rotate-12 text-lg tracking-wider"
                style={{ opacity: likeOpacity }}
              >
                LIKE
              </motion.div>
              <motion.div
                className="absolute top-6 left-6 border-2 border-destructive px-3 py-1 font-body font-bold text-destructive -rotate-12 text-lg tracking-wider"
                style={{ opacity: passOpacity }}
              >
                PASS
              </motion.div>
            </>
          )}

          {/* Culture + Gender */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-body font-medium tracking-widest uppercase text-muted-foreground">
              {cultureEmoji[name.culture]} {name.culture}
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="text-xs font-body font-medium tracking-widest uppercase text-muted-foreground">
              {genderLabel[name.gender]}
            </span>
          </div>

          {/* Name — big and bold */}
          <h2 className="text-6xl md:text-7xl font-display text-foreground mb-4 text-center leading-none italic">
            {name.name}
          </h2>

          {/* Name preview */}
          {namePreview && (
            <p className="text-sm text-muted-foreground font-body mb-4 text-center tracking-wide">
              {namePreview}
            </p>
          )}

          {/* Meaning */}
          <p className="text-lg text-muted-foreground font-body text-center max-w-xs leading-relaxed">
            "{name.meaning}"
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
