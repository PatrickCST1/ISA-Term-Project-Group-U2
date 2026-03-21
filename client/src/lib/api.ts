const BASE = import.meta.env.VITE_BASE_PATH || '';
console.log('BASE PATH:', BASE);
export const apiUrl = (path: string) => `${BASE}${path}`;