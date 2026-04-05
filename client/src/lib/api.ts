const BASE_URL = import.meta.env.VITE_API_URL || '';
const BASE_PATH = import.meta.env.VITE_BASE_PATH || '';

export const apiUrl = (path: string) => `${BASE_URL}${BASE_PATH}${path}`;