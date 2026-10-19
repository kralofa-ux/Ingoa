import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toName } from '@/lib/nameData';
import { readAll } from '@/lib/pagination';
export function useMatches(userId?: string, partnerId?: string, likesKey?: string) {
 const client=useQueryClient();const key=['matches',userId,partnerId,likesKey];
 const query=useQuery({queryKey:key,enabled:Boolean(userId&&partnerId),refetchInterval:15000,queryFn:async()=> {
  if(!userId)return [];
  const {data,error}=await supabase.rpc('get_partner_matches',{requesting_user:userId});
  if(error)throw error;
  const ids=[...new Set((data??[]).map(row=>row.name_id))];
  const names=[];
  for(let start=0;start<ids.length;start+=200){
   const rows=await readAll((from,to)=>supabase.from('names').select('id,name,culture,gender,meaning').in('id',ids.slice(start,start+200)).order('id').range(from,to));
   names.push(...rows.map(toName));
  }
  return names;
 }});
 useEffect(()=> {
  if(!partnerId)return;
  const channel=supabase.channel(`partner-likes-${userId}`).on('postgres_changes',{event:'*',schema:'public',table:'liked_names',filter:`user_id=eq.${partnerId}`},()=>{void client.invalidateQueries({queryKey:['matches',userId]});}).subscribe();
  return ()=>{void supabase.removeChannel(channel);};
 },[client,userId,partnerId]);
 return query;
}
