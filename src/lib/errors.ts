export function errorMessage(error: unknown, fallback = 'Please try again'): string {
 return error && typeof error==='object' && 'message' in error ? String(error.message) : fallback;
}
