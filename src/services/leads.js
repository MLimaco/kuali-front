import { apiService } from './apiService';

export const leadsService = {
    async getAllLeads() {
        try {
            const response = await apiService.get('/leads');
            console.log('API Leads Response:', response);
            return response;
        } catch (error) {
            console.error('Service Error:', error);
            throw error;
        }
    },
};