import { contactLogsService } from '../services/contact-logs.js';

export const ContactLogsController = {
    async getAllLogs() {
        try {
            const response = await contactLogsService.getAllLogs();
            const data = Array.isArray(response) ? response : [];
            return { data };
        } catch (error) {
            console.error('Error fetching contact logs:', error);
            throw error;
        }
    }
};