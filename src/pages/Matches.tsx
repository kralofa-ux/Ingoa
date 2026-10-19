import { useApp } from "@/context/AppContext";
import { usePartner } from "@/hooks/usePartner";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import NameDetail from "@/components/NameDetail";
import { PolynesianName, Culture, Gender } from "@/data/names";
import { useMatches } from "@/hooks/useMatches";
import { Button } from "@/components/ui/button";
import { getGenderColor } from "@/lib/genderColors";
import PageTitle from "@/components/PageTitle";
import NavMatchesIcon from "@/components/icons/NavMatchesIcon";

// Empty state icon using nav matches icon
const EmptyIcon = () => (
  <NavMatchesIcon className="w-16 h-16 mx-auto mb-6 text-foreground opacity-15" />
);

const Matches = () => {
  const { likedNamesA } = useApp();
  const { user } = useAuth();
  const { status, loading: partnerLoading, error: partnerError, refreshStatus } = usePartner();
  const [selectedName, setSelectedName] = useState<PolynesianName | null>(null);
  const {data:matchedNames=[],isLoading:loading,error,refetch}=useMatches(user?.id,status.partner_id,likedNamesA.map(name=>name.id).join(','));
  if (partnerError || error) return <div className="min-h-screen p-8 text-center"><p className="text-foreground mb-4">Unable to load matches. Please try again.</p><Button onClick={()=>{void refetch();void refreshStatus();}}>Retry</Button></div>;

  if (partnerLoading || loading) {
    return (
      <div className="min-h-screen pb-24 px-4 max-w-lg mx-auto bg-[hsl(var(--ingoa-tone-4))] flower-bg" style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
        <PageTitle className="mb-1">Matched Names</PageTitle>
        <div className="space-y-2 mt-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-full bg-foreground/10" />
          ))}
        </div>
      </div>
    );
  }

  if (!status.connected) {
    return (
      <div className="min-h-screen pb-24 px-4 max-w-lg mx-auto bg-[hsl(var(--ingoa-tone-4))] flower-bg" style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
        <PageTitle className="mb-1">Matched Names</PageTitle>
        <div className="text-center py-16">
          <EmptyIcon />
          <h2 className="text-2xl font-display font-extrabold text-foreground uppercase tracking-tight mb-3">
            Connect First
          </h2>
          <p className="text-foreground/60 font-body text-sm max-w-xs mx-auto mb-2">
            Link with your partner to discover names you both love.
          </p>
          <p className="text-xs text-foreground/40 font-body">
            Go to Settings → Couple Mode to generate or enter a code
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4 max-w-lg mx-auto bg-[hsl(var(--ingoa-tone-4))] flower-bg" style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
      <PageTitle className="mb-1">Matched Names</PageTitle>
      <p className="text-sm text-foreground/60 font-body mb-4">
        Names you and {status.partner_name} both loved 💕
      </p>

      {matchedNames.length === 0 ? (
        <div className="text-center py-16">
          <EmptyIcon />
          <h2 className="text-2xl font-display font-extrabold text-foreground uppercase tracking-tight mb-3">
            No Matches Yet
          </h2>
          <p className="text-foreground/60 font-body text-sm max-w-xs mx-auto">
            Keep swiping — matches appear when both of you like the same name.
          </p>
        </div>
      ) : (
        <div className="space-y-2 mt-4">
          <AnimatePresence>
            {matchedNames.map((name, i) => {
              const gColor = getGenderColor(name.gender);
              return (
                <motion.div
                  key={name.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className={`rounded-full py-4 px-5 ${gColor.bg} text-foreground cursor-pointer text-center`}
                  onClick={() => setSelectedName(name)}
                >
                  <h3 className="text-lg font-display font-extrabold uppercase tracking-wider">{name.name}</h3>
                  <p className="text-xs text-foreground/70 font-body mt-0.5">{name.culture}</p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {selectedName && (
          <NameDetail name={selectedName} onClose={() => setSelectedName(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Matches;
