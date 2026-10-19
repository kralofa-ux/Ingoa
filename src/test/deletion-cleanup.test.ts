import { it, expect } from 'vitest';
import { deleteApplicationData, userDataTables } from '../../supabase/functions/delete-account/cleanup';
it('removes feedback, daily swipes and push tokens alongside all other application records before profiles', async()=> {
 const deleted: string[]=[];
 const client={from:(table:string)=>({delete:()=>({eq:async()=>{deleted.push(table);return {error:null};},or:async()=>{deleted.push(table);return {error:null};}})})};
 await deleteApplicationData(client,'test-user');
 expect(deleted).toEqual([...userDataTables,'partner_connections','profiles']);
 expect(deleted).toContain('feedback');expect(deleted).toContain('daily_swipes');expect(deleted).toContain('push_tokens');
});
it('stops cleanup success when deleting any user data fails',async()=> {
 const client={from:()=>({delete:()=>({eq:async()=>({error:new Error('Failed delete')}),or:async()=>({error:null})})})};
 await expect(deleteApplicationData(client,'test-user')).rejects.toThrow('Failed delete');
});
