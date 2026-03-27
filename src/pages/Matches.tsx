import { useApp } from "@/context/AppContext";
import { usePartner } from "@/hooks/usePartner";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import NameDetail from "@/components/NameDetail";
import { PolynesianName, Culture, Gender } from "@/data/names";
import { supabase } from "@/lib/supabase";
import { getGenderColor } from "@/lib/genderColors";
import PageTitle from "@/components/PageTitle";
import navMatches from "@/assets/nav-matches.svg";

// Empty state icon using nav matches icon
const EmptyIcon = () => (
  <img src={navMatches} alt="" className="w-16 h-16 mx-auto mb-6 opacity-15 invert brightness-200" />
);

const Matches = () => {
  const { likedNamesA } = useApp();
  const { user } = useAuth();
  const { status, loading: partnerLoading } = usePartner();
  const [selectedName, setSelectedName] = useState<PolynesianName | null>(null);
  const [matchedNames, setMatchedNames] = useState<PolynesianName[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    if (!user || !status.connected) {
      setMatchedNames([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data: matchIds } = await supabase.rpc("get_partner_matches", {
        requesting_user: user.id,
      });
      if (!matchIds || matchIds.length === 0) {
        setMatchedNames([]);
        setLoading(false);
        return;
      }
      const ids = matchIds.map((r: { name_id: string }) => r.name_id);
      const { data: nameRows } = await supabase
        .from("names")
        .select("id, name, culture, gender, meaning")
        .in("id", ids);
      if (nameRows) {
        setMatchedNames(
          nameRows.map((r) => ({
            id: r.id,
            name: r.name,
            meaning: r.meaning ?? "",
            culture: r.culture as Culture,
            gender: r.gender as Gender,
          }))
        );
      }
    } catch {
      setMatchedNames([]);
    } finally {
      setLoading(false);
    }
  }, [user, status.connected]);

  useEffect(() => { fetchMatches(); }, [fetchMatches, likedNamesA]);

  useEffect(() => {
    if (!status.connected || !status.partner_id) return;
    const channel = supabase
      .channel("partner-likes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "liked_names", filter: `user_id=eq.${status.partner_id}` },
        () => fetchMatches()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [status.connected, status.partner_id, fetchMatches]);

  if (partnerLoading || loading) {
    return (
      <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto flex items-center justify-center bg-[#0012ee] flower-bg">
        <Loader2 className="w-8 h-8 animate-spin text-foreground/50" />
      </div>
    );
  }

  if (!status.connected) {
    return (
      <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto bg-[#0012ee] flower-bg">
        <PageTitle className="mb-1">Matched Names</PageTitle>
        <div className="text-center py-16">
          <TrianglePattern />
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
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto bg-[#0012ee] flower-bg">
      <PageTitle className="mb-1">Matched Names</PageTitle>
      <p className="text-sm text-foreground/60 font-body mb-4">
        Names you and {status.partner_name} both loved 💕
      </p>

      {matchedNames.length === 0 ? (
        <div className="text-center py-16">
          <TrianglePattern />
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
                  className={`rounded-full py-4 px-5 ${gColor.bg} text-white cursor-pointer text-center`}
                  onClick={() => setSelectedName(name)}
                >
                  <h3 className="text-lg font-display font-extrabold uppercase tracking-wider">{name.name}</h3>
                  <p className="text-xs text-white/70 font-body mt-0.5">{name.culture}</p>
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
