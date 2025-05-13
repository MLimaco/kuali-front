import { apiService } from './apiService';

export const templatesService = {
    async getAllTemplates() {
        try {
            const response = await apiService.get('/templates');
            console.log('API Templates Response:', response);
            return response;
        } catch (error) {
            console.error('Service Error:', error);
            throw error;
        }
    },
};