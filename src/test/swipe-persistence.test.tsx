import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppProvider, useApp } from '@/context/AppContext';
import type { PolynesianName } from '@/data/names';
const mocks = vi.hoisted(() => ({ user: { id: 'account-a' } as { id: string } | null, requests: [] as string[], likes: [] as { name_id: string }[], error: null as Error | null }));
vi.mock('@/context/AuthContext', () => ({ useAuth: () => ({ user: mocks.user, profile: null }) }));
vi.mock('@/lib/push', () => ({ notifyLiked: vi.fn() }));
vi.mock('@/lib/supabase', () => ({ supabase: { from: (table: string) => {
 let operation = 'select';
 const builder = {
 select: () => builder, eq: () => builder, in: () => builder, order: () => builder, range: () => builder,
 upsert: () => { operation = 'upsert'; return builder; }, delete: () => { operation = 'delete'; return builder; },
 then: (resolve: (value: unknown) => unknown) => {
  mocks.requests.push(`${table}:${operation}`);
  return Promise.resolve({ data: table === 'liked_names' ? mocks.likes : table === 'names' ? [{ id: 'name-1', name: 'Moana', culture: 'Cook Islands', gender: 'unisex', meaning: 'Ocean' }] : [], error: mocks.error }).then(resolve);
 }
 }; return builder;
} } }));
const name: PolynesianName = { id: 'name-1', name: 'Moana', culture: 'Cook Islands', gender: 'unisex', meaning: 'Ocean' };
describe('persisted swipe behavior', () => {
 beforeEach(() => { mocks.user = { id: 'account-a' }; mocks.requests = []; mocks.likes = []; mocks.error = null; });
 it('executes a cloud delete when undoing a saved like', async () => {
  const { result } = renderHook(() => useApp(), { wrapper: AppProvider });
  await act(async () => { await result.current.likeName(name); });
  await act(async () => { await result.current.undoLastSwipe(); });
  expect(mocks.requests).toContain('liked_names:delete');
 });
 it('clears previous likes when a new account has no saved likes', async () => {
  mocks.likes = [{ name_id: name.id }];
  const { result, rerender } = renderHook(() => useApp(), { wrapper: AppProvider });
  await waitFor(() => expect(result.current.likedNames).toHaveLength(1));
  mocks.likes = []; mocks.user = { id: 'account-b' }; rerender();
  await waitFor(() => expect(result.current.likedNames).toEqual([]));
 });
 it('does not retain a like after its cloud save fails', async () => {
  const { result } = renderHook(() => useApp(), { wrapper: AppProvider });
  await act(async () => {});
  mocks.error = new Error('Offline');
  await act(async () => { try { await result.current.likeName(name); } catch { /* Expected failure. */ } });
  expect(result.current.likedNames).toEqual([]);
 });
});
