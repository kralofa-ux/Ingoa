import SwipeDeck from "@/components/SwipeDeck";

const Browse = () => {
  return (
    <div className="min-h-screen pb-24 flex flex-col bg-[#0015ff]">
      <div className="pt-5 pb-2 px-4 max-w-lg mx-auto w-full border-[#0015ff] bg-[#0015ff]">
        <h1 className="text-3xl font-display font-extrabold text-foreground tracking-tight uppercase bg-[#0015ff]">Ingoa</h1>
      </div>
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full py-2 bg-[#0015ff]">
        <SwipeDeck />
      </div>
    </div>);

};

export default Browse;