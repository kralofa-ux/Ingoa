import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import undoIcon from "@/assets/undo-swipe.svg";

interface SwipeTutorialProps {
  swipeCount: number;
}

const SwipeTutorial = ({ swipeCount }: SwipeTutorialProps) => {
  if (swipeCount >= 5) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-20 pointer-events-none flex items-end justify-center pb-8"
      >
        <div className="flex items-center gap-6 px-5 py-3 rounded-full bg-primary/90 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-primary-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-body font-medium">Pass</span>
          </div>
          <div className="w-px h-5 bg-primary-foreground/30" />
          <div className="flex items-center gap-1.5 text-primary-foreground">
            <span className="text-xs font-body font-medium">Like</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          <div className="w-px h-5 bg-primary-foreground/30" />
          <div className="flex items-center gap-1.5 text-primary-foreground">
            <Undo2 className="w-3.5 h-3.5" />
            <span className="text-xs font-body font-medium">Undo</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SwipeTutorial;
