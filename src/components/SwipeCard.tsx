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
  male: "Tāne",
  female: "Wahine",
  unisex: "Unisex",
};

const SwipeCard = ({ name, onSwipeLeft, onSwipeRight, isTop }: SwipeCardProps) => {
  const { showNamePreview, lastName, middleName } = useApp();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipeRight();
    } else if (info.offset.x < -100) {
      onSwipeLeft();
    }
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
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 }}
      exit={{ x: 300, opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="h-full rounded-2xl bg-card shadow-card border border-border overflow-hidden flex flex-col">
        {/* Top gradient bar */}
        <div className="h-2 gradient-ocean w-full" />
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          {/* Like/Pass overlays */}
          {isTop && (
            <>
              <motion.div
                className="absolute top-6 right-6 rounded-xl border-4 border-palm px-4 py-2 font-body font-bold text-palm rotate-12 text-xl"
                style={{ opacity: likeOpacity }}
              >
                LIKE
              </motion.div>
              <motion.div
                className="absolute top-6 left-6 rounded-xl border-4 border-destructive px-4 py-2 font-body font-bold text-destructive -rotate-12 text-xl"
                style={{ opacity: passOpacity }}
              >
                PASS
              </motion.div>
            </>
          )}

          {/* Culture badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{cultureEmoji[name.culture]}</span>
            <span className="text-sm font-body font-medium text-muted-foreground uppercase tracking-wider">
              {name.culture}
            </span>
          </div>

          {/* Name */}
          <h2 className="text-5xl md:text-6xl font-display text-foreground mb-6 text-center">
            {name.name}
          </h2>

          {/* Name preview with last/middle */}
          {namePreview && (
            <p className="text-base text-muted-foreground font-body mb-4 text-center">
              {namePreview}
            </p>
          )}

          {/* Meaning */}
          <p className="text-xl text-muted-foreground font-body italic text-center max-w-xs mb-6">
            "{name.meaning}"
          </p>

          {/* Gender tag */}
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-body font-medium">
            {genderLabel[name.gender]}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
