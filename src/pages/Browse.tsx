import SwipeDeck from "@/components/SwipeDeck";
import FilterBar from "@/components/FilterBar";
import { useApp } from "@/context/AppContext";
import { Users, User, Settings2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Browse = () => {
  const {
    mode, setMode, switchPartner, currentPartner,
    lastName, setLastName, middleName, setMiddleName,
    showNamePreview, setShowNamePreview,
  } = useApp();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen pb-24 flex flex-col">
      {/* Header */}
      <div className="pt-6 pb-4 px-4 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-display text-foreground">Ingoa</h1>
          <div className="flex items-center gap-2">
            {mode === "couple" && (
              <button
                onClick={switchPartner}
                className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-body font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Switch to {currentPartner === "A" ? "B" : "A"}
              </button>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              title="Name preview settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMode(mode === "solo" ? "couple" : "solo")}
              className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              title={mode === "solo" ? "Switch to couple mode" : "Switch to solo mode"}
            >
              {mode === "solo" ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Name preview settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="p-4 rounded-xl bg-card border border-border shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-body font-medium text-foreground">
                    Show name preview
                  </label>
                  <button
                    onClick={() => setShowNamePreview(!showNamePreview)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      showNamePreview ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-primary-foreground transition-transform mx-1 ${
                        showNamePreview ? "translate-x-4" : ""
                      }`}
                    />
                  </button>
                </div>
                {showNamePreview && (
                  <>
                    <input
                      type="text"
                      placeholder="Middle name (optional)"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground text-sm font-body border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <input
                      type="text"
                      placeholder="Last name (optional)"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground text-sm font-body border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <FilterBar />
      </div>

      {/* Swipe area */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full py-4">
        <SwipeDeck />
      </div>
    </div>
  );
};

export default Browse;
