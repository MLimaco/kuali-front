import { apiService } from './apiService';
import { API_ENDPOINTS } from '../config/apiConfig';

// logsService.js - Versión actualizada con API_ENDPOINTS
export const logsService = {
    // Obtener logs por ID de lead
    async getLogsByLeadId(leadId) {
        try {
            // Esto asume que apiService agrega la base URL, así que usamos rutas relativas
            const response = await apiService.get(`/leads/${leadId}/logs`);
            console.log(`Logs obtenidos para lead ${leadId}:`, response);
            return response;
        } catch (error) {
            console.error(`Error obteniendo logs para lead ${leadId}:`, error);
            throw error;
        }
    },
    
    // Obtener todos los logs
    async getAllLogs() {
        try {
            // Usa la ruta relativa que apiService espera
            const response = await apiService.get('/logs');
            console.log('Todos los logs obtenidos:', response);
            return response;
        } catch (error) {
            console.error('Error obteniendo todos los logs:', error);
            throw error;
        }
    },
    
    // Crear un nuevo log
    async createLog(logData) {
        try {
            const response = await apiService.post('/logs', logData);
            console.log('Log creado:', response);
            return response;
        } catch (error) {
            console.error('Error creando log:', error);
            throw error;
        }
    },
    
    // Actualizar un log existente
    async updateLog(logId, logData) {
        try {
            const response = await apiService.patch(`/logs/${logId}`, logData);
            console.log(`Log ${logId} actualizado:`, response);
            return response;
        } catch (error) {
            console.error(`Error actualizando log ${logId}:`, error);
            throw error;
        }
    },
    
    // Obtener historial de un log
    async getLogHistory(logId) {
        try {
            const response = await apiService.get(`/logsHistory/${logId}`);
            return response;
        } catch (error) {
            console.error(`Error obteniendo historial para log ${logId}:`, error);
            throw error;
        }
    }
};