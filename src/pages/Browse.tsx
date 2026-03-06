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
      <div className="pt-8 pb-4 px-4 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display italic text-foreground">Ingoa</h1>
          <div className="flex items-center gap-1.5">
            {mode === "couple" && (
              <button
                onClick={switchPartner}
                className="px-3 py-1.5 rounded-full text-xs font-body font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                → {currentPartner === "A" ? "B" : "A"}
              </button>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMode(mode === "solo" ? "couple" : "solo")}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              {mode === "solo" ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="p-4 rounded-xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-body text-foreground">
                    Name preview
                  </label>
                  <button
                    onClick={() => setShowNamePreview(!showNamePreview)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      showNamePreview ? "bg-primary" : "bg-muted"
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
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Middle name"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground text-sm font-body border-none focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground text-sm font-body border-none focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
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
