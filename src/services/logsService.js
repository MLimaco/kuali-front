import { apiService } from './apiService';

export const logsService = {
    async getLogsByLeadId(leadId) {
        try {
            const response = await apiService.get(`/logs?leadId=${leadId}`);
            return response;
        } catch (error) {
            console.error('Service Error:', error);
            throw error;
        }
    }
};