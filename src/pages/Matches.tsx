import { useApp } from "@/context/AppContext";
import { usePartner } from "@/hooks/usePartner";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Loader2, Users } from "lucide-react";
import { useState, useEffect } from "react";
import NameDetail from "@/components/NameDetail";
import { PolynesianName } from "@/data/names";
import { supabase } from "@/lib/supabase";

const Matches = () => {
  const { likedNamesA } = useApp();
  const { user } = useAuth();
  const { status, loading: partnerLoading } = usePartner();
  const [selectedName, setSelectedName] = useState<PolynesianName | null>(null);
  const [matchedNames, setMatchedNames] = useState<PolynesianName[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cross-user matches
  useEffect(() => {
    if (!user || !status.connected || !status.partner_id) {
      setMatchedNames([]);
      setLoading(false);
      return;
    }

    const fetchMatches = async () => {
      setLoading(true);
      try {
        // Get partner's liked names
        const { data: partnerLikes } = await supabase
          .from("liked_names")
          .select("name_id")
          .eq("user_id", status.partner_id!);

        if (!partnerLikes || partnerLikes.length === 0) {
          setMatchedNames([]);
          setLoading(false);
          return;
        }

        const partnerIds = new Set(partnerLikes.map((r) => r.name_id));
        const myMatchedIds = likedNamesA
          .filter((n) => partnerIds.has(n.id))
          .map((n) => n.id);

        if (myMatchedIds.length === 0) {
          setMatchedNames([]);
          setLoading(false);
          return;
        }

        // Resolve full name objects
        const { data: nameRows } = await supabase
          .from("names")
          .select("id, name, culture, gender, meaning")
          .in("id", myMatchedIds);

        if (nameRows) {
          setMatchedNames(
            nameRows.map((r) => ({
              id: r.id,
              name: r.name,
              meaning: r.meaning ?? "",
              culture: r.culture as any,
              gender: r.gender as any,
            }))
          );
        }
      } catch {
        setMatchedNames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

    // Subscribe to partner's liked_names for real-time updates
    const channel = supabase
      .channel("partner-likes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "liked_names",
          filter: `user_id=eq.${status.partner_id}`,
        },
        () => fetchMatches()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, status.connected, status.partner_id, likedNamesA]);

  if (partnerLoading || loading) {
    return (
      <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!status.connected) {
    return (
      <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto">
        <h1 className="text-3xl font-display text-foreground mb-1">Matched Names</h1>
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-body mb-2">
            Connect with your partner to see matches
          </p>
          <p className="text-xs text-muted-foreground/70 font-body">
            Go to Settings → Couple Mode to generate or enter a code
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto">
      <h1 className="text-3xl font-display text-foreground mb-1">Matched Names</h1>
      <p className="text-sm text-muted-foreground font-body mb-4">
        Names you and {status.partner_name} both loved 💕
      </p>

      {matchedNames.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🤝</p>
          <p className="text-muted-foreground font-body">
            No matches yet — keep swiping!
          </p>
          <p className="text-xs text-muted-foreground/70 font-body mt-2">
            Matches appear when both of you like the same name
          </p>
        </div>
      ) : (
        <div className="space-y-3 mt-4">
          {matchedNames.map((name, i) => (
            <motion.div
              key={name.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 p-4 rounded-xl gradient-ocean text-primary-foreground shadow-glow-ocean cursor-pointer"
              onClick={() => setSelectedName(name)}
            >
              <Heart className="w-5 h-5 flex-shrink-0" fill="currentColor" />
              <div>
                <h3 className="text-lg font-display">{name.name}</h3>
                <p className="text-sm opacity-80 font-body">
                  {name.meaning} · {name.culture}
                </p>
              </div>
            </motion.div>
          ))}
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
