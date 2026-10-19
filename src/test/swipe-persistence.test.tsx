import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const cleanup: (()=>void)[]=[];
afterEach(()=>{cleanup.splice(0).forEach(dispose=>dispose());});
function renderHook(hook: typeof useApp, { wrapper: Wrapper }: { wrapper: typeof AppProvider }) {
 const host = document.createElement('div');
 const root = createRoot(host);
 const client=new QueryClient({defaultOptions:{queries:{retry:false}}});
 cleanup.push(()=>act(()=>{root.unmount();client.clear();}));
 const result = { current: undefined as ReturnType<typeof useApp> | undefined };
 function Probe() { const value = hook(); useEffect(() => { result.current = value; }); return null; }
 const rerender = () => act(() => root.render(<QueryClientProvider client={client}><Wrapper><Probe /></Wrapper></QueryClientProvider>));
 rerender();
 return { result, rerender };
}
async function waitFor(assertion: () => void) {
 for (let i = 0; i < 10; i++) { await act(async () => {await new Promise(resolve=>setTimeout(resolve,10));}); try { assertion(); return; } catch (e) { if (i === 9) throw e; } }
}
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
  await act(async () => { await result.current?.likeName(name); });
  await act(async () => { await result.current?.undoLastSwipe(); });
  expect(mocks.requests).toContain('liked_names:delete');
 });
 it('clears previous likes when a new account has no saved likes', async () => {
  mocks.likes = [{ name_id: name.id }];
  const { result, rerender } = renderHook(() => useApp(), { wrapper: AppProvider });
  await waitFor(() => expect(result.current?.likedNames).toHaveLength(1));
  mocks.likes = []; mocks.user = { id: 'account-b' }; rerender();
  await waitFor(() => expect(result.current?.likedNames).toEqual([]));
 });
 it('does not retain a like after its cloud save fails', async () => {
  const { result } = renderHook(() => useApp(), { wrapper: AppProvider });
  await act(async () => {});
  mocks.error = new Error('Offline');
  await act(async () => { try { await result.current?.likeName(name); } catch { /* Expected failure. */ } });
  expect(result.current?.likedNames).toEqual([]);
 });
});
