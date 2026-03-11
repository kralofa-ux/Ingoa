import { motion } from "framer-motion";
import { X } from "lucide-react";
import { PolynesianName } from "@/data/names";

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

interface NameDetailProps {
  name: PolynesianName;
  onClose: () => void;
}

const NameDetail = ({ name, onClose }: NameDetailProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-3xl border border-border shadow-card-hover max-w-sm w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{cultureEmoji[name.culture]}</span>
            <span className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-widest">
              {name.culture}
            </span>
          </div>

          <h2 className="text-4xl font-display text-foreground">{name.name}</h2>

          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-wide bg-primary/10 text-primary">
            {genderLabel[name.gender] || "Unisex"}
          </span>

          <p className="text-lg text-muted-foreground font-body italic leading-relaxed">
            "{name.meaning}"
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NameDetail;
