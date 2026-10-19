export async function saveThenNavigate(save: () => Promise<{error: unknown}>, navigate: (path: string) => void, destination: '/browse' | '/subscribe') {
 const {error}=await save();
 if(error)throw error;
 navigate(destination);
}
