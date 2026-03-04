import SwipeDeck from "@/components/SwipeDeck";
import FilterBar from "@/components/FilterBar";
import { useApp } from "@/context/AppContext";
import { Users, User } from "lucide-react";

const Browse = () => {
  const { mode, setMode, switchPartner, currentPartner } = useApp();

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
              onClick={() => setMode(mode === "solo" ? "couple" : "solo")}
              className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              title={mode === "solo" ? "Switch to couple mode" : "Switch to solo mode"}
            >
              {mode === "solo" ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
            </button>
          </div>
        </div>
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
