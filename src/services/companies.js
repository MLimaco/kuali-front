import { apiService } from './apiService';

export const companiesService = {
    async getAllCompanies(page = 1, limit = 20) {
        try {
            const response = await apiService.get('/companies', { page, limit });
            console.log('API Response:', response); // Para depuración
            return response;
        } catch (error) {
            console.error('Service Error:', error);
            throw error;
        }
    },
};