import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
interface PartnerStatus { connected: boolean; partner_name?: string; partner_id?: string; connection_id?: string }
export const usePartner = () => {
 const { user, session, refreshProfile } = useAuth();
 const refreshProfileRef=useRef(refreshProfile);refreshProfileRef.current=refreshProfile;
 const client=useQueryClient();const key=['partner-status',user?.id];
 const [code,setCode]=useState<string|null>(null);
 const invoke=useCallback(async(action:string,extra:Record<string,string>={})=>{
  if(!session)throw new Error('Please sign in again');
  const {data,error}=await supabase.functions.invoke('partner-code',{body:{action,...extra}});
  if(error)throw error;
  if(data?.error)throw new Error(data.error);
  return data;
 },[session]);
 const query=useQuery<PartnerStatus>({queryKey:key,queryFn:()=>invoke('status'),enabled:Boolean(user && session),refetchInterval:code?3000:15000,refetchOnWindowFocus:true});
 useEffect(()=>{setCode(null);},[user?.id]);
 useEffect(()=>{if(query.data?.connected) {setCode(null);void refreshProfileRef.current();}},[query.data?.connected]);
 const refreshStatus=useCallback(async()=>{await client.invalidateQueries({queryKey:['partner-status',user?.id]});},[client,user?.id]);
 const generateCode=useCallback(async()=>{const data=await invoke('generate');setCode(data.code);return data.code;},[invoke]);
 const joinCode=useCallback(async(inputCode:string)=>{const data=await invoke('join',{code:inputCode});await refreshStatus();return data;},[invoke,refreshStatus]);
 const disconnect=useCallback(async()=>{await invoke('disconnect');setCode(null);await refreshStatus();},[invoke,refreshStatus]);
 return {status:query.data??{connected:false},loading:query.isLoading,error:query.error,code,generateCode,joinCode,disconnect,refreshStatus};
};
