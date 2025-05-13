import { leadsService } from '../services/leads.js';

export const LeadsController = {
    async getAllLeads() {
        try {
            const response = await leadsService.getAllLeads();
            const data = Array.isArray(response) ? response : [];
            return { data };
        } catch (error) {
            console.error('Error fetching leads:', error);
            throw error;
        }
    }
};