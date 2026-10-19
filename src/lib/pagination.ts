export const PAGE_SIZE = 500;
export async function readAll<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
 const rows: T[] = [];
 for (let from = 0; ; from += PAGE_SIZE) {
  const result = await page(from, from + PAGE_SIZE - 1);
  if (result.error) throw result.error;
  const data = result.data ?? [];
  rows.push(...data);
  if (data.length < PAGE_SIZE) return rows;
 }
}
