import { API_CONFIG } from '../config/api.config';

export const wordService = {


    async getAllWords() {
        const response = await fetch(`${API_CONFIG.baseURL}words/getAllWords`);
        if (!response.status === 500) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    async getAllWordTypes() {
        const response = await fetch(`${API_CONFIG.baseURL}words/getAllWordTypes`);
        if (!response.status === 500) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },


    async createWord(word) {
        const response = await fetch(`${API_CONFIG.baseURL}words/addWord`, {
            method: 'POST',
            headers: API_CONFIG.headers,
            body: JSON.stringify(word)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    async updateWord(id, word) {
        const response = await fetch(`${API_CONFIG.baseURL}words/updateWordById/${id}`, {
            method: 'PUT',
            headers: API_CONFIG.headers,
            body: JSON.stringify(word)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    async deleteWord(id) {
        console.log()
        const response = await fetch(`${API_CONFIG.baseURL}words/deleteWordById/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.status === 204 ? null : response.json();
    }
};