import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import type { PolynesianName, Culture, Gender } from '@/data/names';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { notifyLiked } from '@/lib/push';
import { readAll } from '@/lib/pagination';
import { toName } from '@/lib/nameData';
interface Swipe { name: PolynesianName; action: 'like' | 'pass' }
interface AppContextType {
 mode: 'solo' | 'couple'; likedNames: PolynesianName[]; likedNamesA: PolynesianName[];
 passedIds: Set<string>; cultureFilter: Culture[]; genderFilter: Gender | 'all';
 lastName: string; middleName: string; showNamePreview: boolean; swipeHistory: Swipe[];
 swipeLoading: boolean; swipeError: string | null; retrySwipes: () => void;
 likeName: (name: PolynesianName) => Promise<void>; passName: (id: string, name?: PolynesianName) => Promise<void>;
 removeLikedName: (id: string) => Promise<void>; undoLastSwipe: () => Promise<PolynesianName | null>; refreshDeck: () => Promise<void>;
 setCultureFilter: (cultures: Culture[]) => void; setGenderFilter: (gender: Gender | 'all') => void;
 setLastName: (name: string) => void; setMiddleName: (name: string) => void; setShowNamePreview: (enabled: boolean) => void;
}
const AppContext = createContext<AppContextType | null>(null);
export const useApp = () => { const ctx = useContext(AppContext); if (!ctx) throw new Error('useApp must be inside AppProvider'); return ctx; };
export const AppProvider = ({ children }: { children: ReactNode }) => {
 const { profile, user } = useAuth();
 const userId = user?.id;
 const activeUser = useRef(userId); activeUser.current = userId;
 const [likedNames, setLikedNames] = useState<PolynesianName[]>([]);
 const [passedIds, setPassedIds] = useState<Set<string>>(new Set());
 const [swipeHistory, setHistory] = useState<Swipe[]>([]);
 const [cultureFilter, setCultureFilter] = useState<Culture[]>([]);
 const [genderFilter, setGenderFilter] = useState<Gender | 'all'>('all');
 const [lastName, setLastName] = useState(''); const [middleName, setMiddleName] = useState('');
 const [showNamePreview, setShowNamePreview] = useState(false);
 const [swipeLoading, setLoading] = useState(false); const [swipeError, setError] = useState<string | null>(null);
 const [reload, setReload] = useState(0);
 useEffect(() => {
  setCultureFilter((profile?.selected_cultures ?? []) as Culture[]);
  setGenderFilter(profile?.gender_preference === 'male' || profile?.gender_preference === 'female' ? profile.gender_preference : 'all');
  setLastName(profile?.last_name ?? ''); setMiddleName(profile?.middle_name ?? '');
  setShowNamePreview(Boolean(profile?.last_name?.trim() || profile?.middle_name?.trim()));
 }, [profile]);
 useEffect(() => {
  let current = true;
  setLikedNames([]); setPassedIds(new Set()); setHistory([]); setError(null);
  if (!userId) { setLoading(false); return; }
  setLoading(true);
  void (async () => {
   try {
    const [likes, passes] = await Promise.all([
     readAll((from,to) => supabase.from('liked_names').select('name_id').eq('user_id',userId).order('id').range(from,to)),
     readAll((from,to) => supabase.from('passed_names').select('name_id').eq('user_id',userId).order('id').range(from,to)),
    ]);
    const names: PolynesianName[] = [];
    for (let start=0; start<likes.length; start+=200) {
     const ids = likes.slice(start,start+200).map(row=>row.name_id);
     const rows = await readAll((from,to) => supabase.from('names').select('id,name,culture,gender,meaning').in('id',ids).order('id').range(from,to));
     names.push(...rows.map(toName));
    }
    if (!current) return;
    setLikedNames(names); setPassedIds(new Set(passes.map(row=>row.name_id)));
   } catch (error) { if (current) setError(error instanceof Error ? error.message : 'Unable to load saved names'); }
   finally { if (current) setLoading(false); }
  })();
  return () => { current = false; };
 }, [userId,reload]);
 const saveSwipe = useCallback(async (name: PolynesianName, action: 'like' | 'pass') => {
  if (!userId) throw new Error('Please sign in again');
  const table = action === 'like' ? 'liked_names' : 'passed_names';
  const { error } = await supabase.from(table).upsert({ user_id:userId, name_id:name.id },{onConflict:'user_id,name_id'});
  if (error) throw error;
  if (activeUser.current !== userId) return;
  if (action === 'like') { setLikedNames(prev => prev.some(item=>item.id===name.id) ? prev : [...prev,name]); notifyLiked(name.id); }
  else setPassedIds(prev=>new Set(prev).add(name.id));
  setHistory(prev=>[...prev,{name,action}]);
 }, [userId]);
 const likeName = useCallback((name: PolynesianName) => saveSwipe(name,'like'),[saveSwipe]);
 const passName = useCallback(async (id: string, name?: PolynesianName) => {
  if (name) return saveSwipe(name,'pass');
  if (!userId) throw new Error('Please sign in again');
  const { error } = await supabase.from('passed_names').upsert({user_id:userId,name_id:id},{onConflict:'user_id,name_id'});
  if (error) throw error;
  if (activeUser.current===userId) setPassedIds(prev=>new Set(prev).add(id));
 },[saveSwipe,userId]);
 const removeLikedName = useCallback(async (id: string) => {
  if (!userId) throw new Error('Please sign in again');
  const { error } = await supabase.from('liked_names').delete().eq('user_id',userId).eq('name_id',id);
  if (error) throw error;
  if (activeUser.current===userId) setLikedNames(prev=>prev.filter(name=>name.id!==id));
 },[userId]);
 const undoLastSwipe = useCallback(async () => {
  const last = swipeHistory.at(-1);
  if (!last || !userId) return null;
  const { error } = await supabase.from(last.action==='like' ? 'liked_names':'passed_names').delete().eq('user_id',userId).eq('name_id',last.name.id);
  if (error) throw error;
  if (activeUser.current!==userId) return null;
  if (last.action==='like') setLikedNames(prev=>prev.filter(name=>name.id!==last.name.id));
  else setPassedIds(prev=> { const next=new Set(prev); next.delete(last.name.id); return next; });
  setHistory(prev=>prev.slice(0,-1));
  return last.name;
 },[swipeHistory,userId]);
 const refreshDeck = useCallback(async () => {
  if (!userId) throw new Error('Please sign in again');
  const { error } = await supabase.from('passed_names').delete().eq('user_id',userId);
  if (error) throw error;
  if (activeUser.current===userId) { setPassedIds(new Set()); setHistory([]); }
 },[userId]);
 return <AppContext.Provider value={{mode:profile?.mode==='couple'?'couple':'solo',likedNames,likedNamesA:likedNames,passedIds,cultureFilter,genderFilter,lastName,middleName,showNamePreview,swipeHistory,swipeLoading,swipeError,retrySwipes:()=>setReload(value=>value+1),likeName,passName,removeLikedName,undoLastSwipe,refreshDeck,setCultureFilter,setGenderFilter,setLastName,setMiddleName,setShowNamePreview}}>{children}</AppContext.Provider>;
};
