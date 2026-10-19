import { describe, it, expect } from 'vitest';
import { buildWeightedDeck } from '@/lib/deck';
import { readAll, PAGE_SIZE } from '@/lib/pagination';
import { reconcileOrder, toName } from '@/lib/nameData';
const names = [1,2,3,4].map(id => toName({ id: String(id), name: 'Moana', meaning: null, gender: 'unisex', culture: 'Cook Islands', commonality_score: id === 1 ? 3 : 2 }));
describe('name data', () => {
 it('returns every unseen name exactly once without an advancing shrinking-array index', () => {
  const deck = buildWeightedDeck(names,new Set(['2']),new Set(['3']),() => 0);
  const seen: string[] = []; while (deck.length) { const current = deck.shift(); if (current) seen.push(current.id); }
  expect(seen).toEqual(['1','4']);
 });
 it('uses common, normal and rare tier weights of 40, 40 and 20 percent', () => {
  const tiers = [3,2,1].map((score,i) => ({ ...names[0], id: String(i), commonalityScore: score }));
  expect(buildWeightedDeck(tiers,new Set(),new Set(),() => 0.39)[0].commonalityScore).toBe(3);
  expect(buildWeightedDeck(tiers,new Set(),new Set(),() => 0.4)[0].commonalityScore).toBe(2);
  expect(buildWeightedDeck(tiers,new Set(),new Set(),() => 0.8)[0].commonalityScore).toBe(1);
 });
 it('retains custom order and appends newly arriving likes', () => { expect(reconcileOrder([names[1],names[0]],names).map(n=>n.id)).toEqual(['2','1','3','4']); });
 it('reads past one response page', async () => {
  const fixture = Array.from({length: PAGE_SIZE+7},(_,i)=>i);
  expect(await readAll(async (from,to) => ({data:fixture.slice(from,to+1),error:null}))).toEqual(fixture);
 });
 it('does not turn a failed collection read into an empty result', async () => { await expect(readAll(async () => ({data:null,error:new Error('Offline')}))).rejects.toThrow('Offline'); });
});
