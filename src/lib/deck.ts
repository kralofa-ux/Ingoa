import type { PolynesianName } from '@/data/names';
export function buildWeightedDeck(names: PolynesianName[], passed: Set<string>, liked: Set<string>, random = Math.random): PolynesianName[] {
 const buckets = [3,2,1].map(score => names.filter(n => !passed.has(n.id) && !liked.has(n.id) && (n.commonalityScore ?? 2) === score));
 const weights = [0.4,0.4,0.2];
 const result: PolynesianName[] = [];
 while (buckets.some(bucket => bucket.length)) {
  const total = buckets.reduce((sum, bucket, i) => sum + (bucket.length ? weights[i] : 0), 0);
  let target = random() * total;
  let selected = buckets.findIndex((bucket,i) => { if (!bucket.length) return false; target -= weights[i]; return target < 0; });
  if (selected < 0) selected = buckets.findIndex(bucket => bucket.length > 0);
  const bucket = buckets[selected];
  const [name] = bucket.splice(Math.min(bucket.length - 1, Math.floor(random() * bucket.length)), 1);
  if (name) result.push(name);
 }
 return result;
}
