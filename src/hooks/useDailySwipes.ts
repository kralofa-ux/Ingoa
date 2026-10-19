import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
export const DAILY_SWIPE_LIMIT = 20;
export const swipeDate = (date = new Date()) => date.toISOString().slice(0,10);
export function useDailySwipes(userId?: string) {
 const [count,setCount]=useState(0); const [loading,setLoading]=useState(true); const [error,setError]=useState(false);
 const [date,setDate]=useState(swipeDate()); const request=useRef(0);
 useEffect(()=> {
  const refresh=()=>setDate(swipeDate());
  const timer=setInterval(refresh,30_000); document.addEventListener('visibilitychange',refresh);
  return ()=>{clearInterval(timer);document.removeEventListener('visibilitychange',refresh);};
 },[]);
 const refresh=useCallback(async()=> {
  const version=++request.current;
  if(!userId){setCount(0);setLoading(false);return;}
  setLoading(true);setError(false);
  const {data,error}=await supabase.from('daily_swipes').select('swipe_count').eq('user_id',userId).eq('swipe_date',date).maybeSingle();
  if(version!==request.current)return;
  if(error)setError(true);else setCount(data?.swipe_count??0);
  setLoading(false);
 },[userId,date]);
 useEffect(()=>{void refresh();return()=>{request.current++;};},[refresh]);
 const record=useCallback(async()=> {
  const version=request.current;
  const {data,error}=await supabase.rpc('record_swipe');
  if(error)throw error;
  if(version===request.current && typeof data==='number')setCount(data);
 },[]);
 return {count,loading,error,refresh,record};
}
