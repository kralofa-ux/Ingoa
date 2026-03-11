import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { PolynesianName } from "@/data/names";
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

const genderConfig: Record<string, { label: string; color: string }> = {
  male: { label: "Tāne", color: "bg-primary/10 text-primary" },
  female: { label: "Wahine", color: "bg-accent/10 text-accent" },
  unisex: { label: "Unisex", color: "bg-muted text-muted-foreground" },
};

const SwipeCard = ({ name, onSwipeLeft, onSwipeRight, isTop }: SwipeCardProps) => {
  const { showNamePreview, lastName, middleName } = useApp();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
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

  const gender = genderConfig[name.gender] || genderConfig.unisex;

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
      <div className="h-full rounded-3xl bg-card shadow-card border border-border overflow-hidden flex flex-col">
        {/* Top gradient bar */}
        <div className="h-1.5 gradient-ocean w-full" />

        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
          {/* Like/Pass overlays */}
          <motion.div
            className="absolute top-5 right-5 rounded-2xl border-[3px] border-palm px-4 py-2 font-body font-bold text-palm rotate-12 text-lg"
            style={{ opacity: likeOpacity }}
          >
            LIKE
          </motion.div>
          <motion.div
            className="absolute top-5 left-5 rounded-2xl border-[3px] border-destructive px-4 py-2 font-body font-bold text-destructive -rotate-12 text-lg"
            style={{ opacity: passOpacity }}
          >
            PASS
          </motion.div>

          {/* Layout: Culture (top) → Name (center) → Gender (below) → Meaning (bottom) */}

          {/* Culture badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl">{cultureEmoji[name.culture]}</span>
            <span className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-widest">
              {name.culture}
            </span>
          </div>

          {/* Name */}
          <h2 className="text-5xl md:text-6xl font-display text-foreground mb-3 text-center leading-tight">
            {name.name}
          </h2>

          {/* Name preview with last/middle */}
          {namePreview && (
            <p className="text-sm text-muted-foreground font-body mb-4 text-center">
              {namePreview}
            </p>
          )}

          {/* Gender tag */}
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-wide mb-5 ${gender.color}`}>
            {gender.label}
          </span>

          {/* Meaning */}
          <p className="text-lg text-muted-foreground font-body italic text-center max-w-[280px] leading-relaxed">
            "{name.meaning}"
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
