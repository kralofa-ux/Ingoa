import SwipeDeck from "@/components/SwipeDeck";
import FilterBar from "@/components/FilterBar";

const Browse = () => {
  return (
    <div className="min-h-screen pb-24 flex flex-col">
      {/* Header */}
      <div className="pt-5 pb-3 px-4 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-display text-foreground">Ingoa</h1>
        </div>
        <FilterBar />
      </div>

      {/* Swipe area */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full py-2">
        <SwipeDeck />
      </div>
    </div>
  );
};

export default Browse;
