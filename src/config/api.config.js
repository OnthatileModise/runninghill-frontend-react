export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8089/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
};