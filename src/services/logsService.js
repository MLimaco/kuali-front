import { apiService } from './apiService'; // <-- Agrega esta línea

// logsService.js
export const logsService = {
    async getLogsByLeadId(leadId) {
        try {
            // Cambia la ruta para que coincida con tu backend
            const response = await apiService.get(`/leads/${leadId}/logs`);
            return response;
        } catch (error) {
            console.error('Service Error:', error);
            throw error;
        }
    },
        // Nuevo método para obtener todos los logs
    async getAllLogs() {
        try {
            const response = await apiService.get('/logs');
            return response;
        } catch (error) {
            console.error('Service Error:', error);
            throw error;
        }
    }
};
