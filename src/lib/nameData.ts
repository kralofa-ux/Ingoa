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
 'Cook Islands': 'bg-[hsl(var(--ingoa-tone-7))]',
 'Samoa': 'bg-[hsl(var(--ingoa-tone-12))]',
 'Aotearoa': 'bg-[hsl(var(--ingoa-tone-9))]',
 'Tonga': 'bg-[hsl(var(--ingoa-tone-13))]',
 'Fiji': 'bg-[hsl(var(--ingoa-tone-14))]',
 'Hawaii': 'bg-[hsl(var(--ingoa-tone-8))]',
 'Niue': 'bg-[hsl(var(--ingoa-tone-15))]',
 'Tahiti': 'bg-[hsl(var(--ingoa-tone-10))]',
};
