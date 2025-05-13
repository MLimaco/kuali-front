const API_BASE_URL = import.meta.env.VITE_API_URL + '/api';

export const apiService = {
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url);
        return await response.json();
    },

    async post(endpoint, data) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    }
};