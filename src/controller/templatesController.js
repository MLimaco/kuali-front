import { templatesService } from '../services/templates.js';

export const TemplatesController = {
    async getAllTemplates() {
        try {
            const response = await templatesService.getAllTemplates();
            const data = Array.isArray(response) ? response : [];
            return { data };
        } catch (error) {
            console.error('Error fetching templates:', error);
            throw error;
        }
    }
};