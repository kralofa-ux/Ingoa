import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { readAll } from '@/lib/pagination';
import { toName } from '@/lib/nameData';
export { buildWeightedDeck } from '@/lib/deck';
export const useNames = () => useQuery({
 queryKey: ['names'],
 queryFn: async () => (await readAll((from,to) => supabase.from('names').select('id, name, culture, gender, meaning, commonality_score').eq('status','active').order('id').range(from,to))).map(toName),
 staleTime: 600_000, retry: 3, retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000),
});
