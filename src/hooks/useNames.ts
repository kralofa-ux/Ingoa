import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PolynesianName, Culture, Gender } from "@/data/names";

export const useNames = () => {
  return useQuery({
    queryKey: ["names"],
    queryFn: async (): Promise<PolynesianName[]> => {
      const { data, error } = await supabase
        .from("names")
        .select("id, name, culture, gender, meaning, commonality_score")
        .eq("status", "active");

      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        meaning: row.meaning ?? "",
        culture: row.culture as Culture,
        gender: row.gender as Gender,
        commonalityScore: row.commonality_score as number,
      }));
    },
    staleTime: 1000 * 60 * 10, // 10 min cache
  });
};

/**
 * Build a weighted-random deck from names:
 * 40% common (score=3), 40% normal (score=2), 20% rare (score=1)
 * Falls back gracefully when a tier has fewer names.
 */
export function buildWeightedDeck(
  names: (PolynesianName & { commonalityScore?: number })[],
  passedIds: Set<string>,
  likedIds: Set<string>,
): PolynesianName[] {
  const available = names.filter(
    (n) => !passedIds.has(n.id) && !likedIds.has(n.id),
  );

  const common = available.filter((n) => (n as any).commonalityScore === 3);
  const normal = available.filter((n) => (n as any).commonalityScore === 2 || !(n as any).commonalityScore);
  const rare = available.filter((n) => (n as any).commonalityScore === 1);

  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const total = available.length;
  const commonCount = Math.round(total * 0.4);
  const normalCount = Math.round(total * 0.4);
  // rare gets the rest

  const picked = [
    ...shuffle(common).slice(0, commonCount),
    ...shuffle(normal).slice(0, normalCount),
    ...shuffle(rare),
  ];

  // If we didn't fill quotas, add remaining from other tiers
  const pickedIds = new Set(picked.map((n) => n.id));
  const remaining = available.filter((n) => !pickedIds.has(n.id));

  return shuffle([...picked, ...remaining]);
}
