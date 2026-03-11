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
