import { motion } from "framer-motion";
import { X, Share2 } from "lucide-react";
import { PolynesianName } from "@/data/names";
import CultureIcon from "@/components/CultureIcon";
import { getGenderColor, genderLabel } from "@/lib/genderColors";
import { useApp } from "@/context/AppContext";

interface NameDetailProps {
  name: PolynesianName;
  onClose: () => void;
}

const NameDetail = ({ name, onClose }: NameDetailProps) => {
  const gColor = getGenderColor(name.gender);
  const { showNamePreview, middleName, lastName } = useApp();

  const shareName = () => {
    const text = `${name.name}\n${name.meaning}\n${name.culture}`;
    if (navigator.share) {
      navigator.share({ title: name.name, text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const previewLines = [];
  if (showNamePreview) {
    previewLines.push(name.name);
    if (middleName.trim()) {
      previewLines.push(`${name.name} ${middleName.trim()}`);
    }
    if (middleName.trim() && lastName.trim()) {
      previewLines.push(`${name.name} ${middleName.trim()} ${lastName.trim()}`);
    } else if (lastName.trim()) {
      previewLines.push(`${name.name} ${lastName.trim()}`);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-lg p-4"
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
            <CultureIcon culture={name.culture} size={24} />
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

          {/* Name Preview */}
          {showNamePreview && previewLines.length > 1 && (
            <div className="pt-2 space-y-1.5">
              <p className="text-[10px] font-body font-bold text-white/40 uppercase tracking-[0.2em]">
                Name Preview
              </p>
              {previewLines.map((line, i) => (
                <p
                  key={i}
                  className={`font-display font-extrabold text-white/90 ${
                    i === previewLines.length - 1 ? "text-xl" : "text-sm text-white/60"
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="pt-2">
            <button
              onClick={shareName}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors backdrop-blur-sm text-xs font-body font-bold tracking-widest uppercase"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NameDetail;
