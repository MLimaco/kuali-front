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
    async createLead(data) {
        return await fetch('http://localhost:3000/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },
};