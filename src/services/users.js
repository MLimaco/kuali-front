import { apiService } from './apiService';

export const usersService = {
    async getAllUsers() {
        try {
            const response = await apiService.get('/users');
            console.log('API Users Response:', response);
            return response;
        } catch (error) {
            console.error('Service Error:', error);
            throw error;
        }
    },
};