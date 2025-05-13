import { apiService } from './apiService';

export const contactLogsService = {
    async getAllLogs() {
        try {
            const response = await apiService.get('/logs');
            console.log('API ContactLogs Response:', response);
            return response;
        } catch (error) {
            console.error('Service Error:', error);
            throw error;
        }
    },
};