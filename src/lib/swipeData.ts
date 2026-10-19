import { supabase } from '@/lib/supabase';
import { readAll } from '@/lib/pagination';
import { toName } from '@/lib/nameData';
import type { PolynesianName } from '@/data/names';
export async function loadSwipeData(userId: string) {
 const [likes,passes]=await Promise.all([
  readAll((from,to)=>supabase.from('liked_names').select('name_id').eq('user_id',userId).order('id').range(from,to)),
  readAll((from,to)=>supabase.from('passed_names').select('name_id').eq('user_id',userId).order('id').range(from,to)),
 ]);
 const names: PolynesianName[]=[];
 for(let start=0;start<likes.length;start+=200){
  const ids=likes.slice(start,start+200).map(row=>row.name_id);
  names.push(...(await readAll((from,to)=>supabase.from('names').select('id,name,culture,gender,meaning').in('id',ids).order('id').range(from,to))).map(toName));
 }
 return {likedNames:names,passedIds:new Set(passes.map(row=>row.name_id))};
}
