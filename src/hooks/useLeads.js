// Hook personalizado para manejar toda la lógica de leads, empresas, usuarios y logs
import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../config/apiConfig';
import { leadsService } from '../services/leads';
import { companiesService } from '../services/companies';
import { logsService } from '../services/logsService';
import { apiService } from '../services/apiService';

// Función para obtener usuarios desde el backend
const fetchUsers = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.USERS);
        if (!response.ok) throw new Error('Error al obtener usuarios');
        return await response.json();
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        return [];
    }
};

export function useLeads() {
    // Estados para leads, empresas, usuarios, logs y sus cargas
    const [leads, setLeads] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const [loadingLogs, setLoadingLogs] = useState(false);

    // Al montar el hook, carga leads, empresas y usuarios
    useEffect(() => {
        (async () => {
            setLoadingLeads(true);
            setLeads(await leadsService.getAllLeads()); // Llama al servicio de leads
            setCompanies(await companiesService.getAllCompanies()); // Llama al servicio de empresas
            setUsers(await fetchUsers()); // Llama a la función local para usuarios
            setLoadingLeads(false);
        })();
    }, []);

    // Función para cargar todos los logs
    const fetchAllLogs = useCallback(async () => {
        setLoadingLogs(true);
        try {
            const response = await apiService.get('/logs');
            console.log('Todos los logs obtenidos (raw):', response);

            // IMPORTANTE: Si apiService devuelve { data: [...] }, necesitas extraer .data
            const logsData = response.data || response;

            console.log('Logs procesados:', logsData);
            setLogs(logsData); // Actualiza el estado con los datos
            return logsData;
        } catch (error) {
            console.error('Error obteniendo todos los logs:', error);
            return [];
        } finally {
            setLoadingLogs(false);
        }
    }, []);

    // IMPORTANTE: Cargar logs al inicializar el hook
    useEffect(() => {
        // Al iniciar el componente, carga todos los logs
        console.log("Cargando todos los logs automáticamente al iniciar...");
        fetchAllLogs()
            .then(logsData => console.log(`Se cargaron ${logsData?.length || 0} logs automáticamente`))
            .catch(err => console.error("Error cargando logs iniciales:", err));
    }, [fetchAllLogs]); // Dependencia: fetchAllLogs

    // Función para traer logs de un lead específico
    const fetchLogsByLead = async (leadId) => {
        setLoadingLogs(true);
        try {
            const leadLogs = await logsService.getLogsByLeadId(leadId);
            setLogs(leadLogs); // Llama al servicio de logs
            return leadLogs;
        } catch (error) {
            console.error(`Error cargando logs para lead ${leadId}:`, error);
            return [];
        } finally {
            setLoadingLogs(false);
        }
    };

    // Retorna los estados y funciones para ser usados en el componente principal
    return {
        leads, setLeads,
        companies,
        users,
        logs,
        fetchLogsByLead,
        fetchAllLogs,
        loadingLeads,
        loadingLogs
    };
}