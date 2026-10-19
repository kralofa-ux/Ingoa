export const userDataTables = ['liked_names','passed_names','partner_codes','feedback','daily_swipes','push_tokens'] as const;
interface CleanupClient {
 from: (table: string) => { delete: () => { eq: (column: string, id: string) => PromiseLike<{error: unknown}>; or: (filter: string) => PromiseLike<{error:unknown}> } };
}
export async function deleteApplicationData(client: CleanupClient, userId: string) {
 const results = await Promise.all([
  ...userDataTables.map(table=>client.from(table).delete().eq('user_id',userId)),
  client.from('partner_connections').delete().or(`user_a.eq.${userId},user_b.eq.${userId}`),
 ]);
 const failure=results.find(result=>result.error);
 if(failure)throw failure.error;
 const profile=await client.from('profiles').delete().eq('user_id',userId);
 if(profile.error)throw profile.error;
}
