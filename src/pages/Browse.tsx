import SwipeDeck from "@/components/SwipeDeck";
import PageTitle from "@/components/PageTitle";

const Browse = () => {
  return (
    <div className="min-h-screen pb-24 flex flex-col bg-[#0012ee] flower-bg">
      <div className="pb-2 px-4 max-w-lg mx-auto w-full" style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}>
        <PageTitle>Ingoa</PageTitle>
      </div>
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full py-2">
        <SwipeDeck />
      </div>
    </div>);

};

export default Browse;