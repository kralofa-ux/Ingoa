import type { Culture, Gender, PolynesianName } from '@/data/names';
export const cultureOptions: Culture[] = ['Cook Islands', 'Samoa', 'Aotearoa', 'Tonga', 'Fiji', 'Hawaii', 'Niue', 'Tahiti'];
interface NameData { id: string; name: string; meaning: string | null; culture: string; gender: string; commonality_score?: number }
export function toName(row: NameData): PolynesianName {
 if (!cultureOptions.includes(row.culture as Culture) || !['male','female','unisex'].includes(row.gender)) throw new Error('Invalid name data');
 return { id: row.id, name: row.name, meaning: row.meaning ?? '', culture: row.culture as Culture, gender: row.gender as Gender, commonalityScore: row.commonality_score };
}
export function reconcileOrder<T extends { id: string }>(ordered: T[], available: T[]): T[] {
 const byId = new Map(available.map(item => [item.id, item]));
 const retained = ordered.flatMap(item => { const current = byId.get(item.id); if (!current) return []; byId.delete(item.id); return [current]; });
 return [...retained, ...byId.values()];
}

export const preferenceCultureClasses = {
 'Cook Islands': 'bg-[hsl(var(--action-cyan))]',
 'Samoa': 'bg-[hsl(var(--preference-samoa))]',
 'Aotearoa': 'bg-[hsl(var(--preference-aotearoa))]',
 'Tonga': 'bg-[hsl(var(--preference-tonga))]',
 'Fiji': 'bg-[hsl(var(--preference-fiji))]',
 'Hawaii': 'bg-[hsl(var(--preference-niue))]',
 'Niue': 'bg-[hsl(var(--preference-niue-deep))]',
 'Tahiti': 'bg-[hsl(var(--preference-tahiti))]',
};
