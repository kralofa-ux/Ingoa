import { motion } from "framer-motion";
import { X } from "lucide-react";
import { PolynesianName } from "@/data/names";
import { cultureEmoji } from "@/lib/cultureColors";
import { getGenderColor, genderLabel } from "@/lib/genderColors";

interface NameDetailProps {
  name: PolynesianName;
  onClose: () => void;
}

const NameDetail = ({ name, onClose }: NameDetailProps) => {
  const gColor = getGenderColor(name.gender);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`${gColor.bg} rounded-3xl shadow-card-hover max-w-sm w-full p-8 relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors backdrop-blur-sm"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-5">
          {/* Culture */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{cultureEmoji[name.culture]}</span>
            <span className="text-xs font-body font-bold text-white/60 uppercase tracking-[0.2em]">
              {name.culture}
            </span>
          </div>

          {/* Name */}
          <h2 className="text-5xl font-display font-extrabold text-white tracking-tight">{name.name}</h2>

          {/* Meaning */}
          <p className="text-lg text-white/80 font-body leading-relaxed font-medium">
            {name.meaning}
          </p>

          {/* Gender */}
          <span className="inline-block px-5 py-2 rounded-full text-xs font-body font-bold tracking-widest uppercase bg-white/15 text-white backdrop-blur-sm">
            {genderLabel[name.gender] || "Unisex"}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NameDetail;
