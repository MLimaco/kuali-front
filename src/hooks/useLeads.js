// Hook personalizado para manejar toda la lógica de leads, empresas, usuarios y logs
import { useState, useEffect } from 'react';
import { leadsService } from '../services/leads';
import { companiesService } from '../services/companies';
import { logsService } from '../services/logsService';

// Función para obtener usuarios desde el backend
const fetchUsers = async () => {
    const response = await fetch('http://localhost:3000/api/users');
    return await response.json();
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

    // Función para traer logs de un lead específico
    const fetchLogsByLead = async (leadId) => {
        setLoadingLogs(true);
        setLogs(await logsService.getLogsByLeadId(leadId)); // Llama al servicio de logs
        setLoadingLogs(false);
    };

    // Retorna los estados y funciones para ser usados en el componente principal
    return {
        leads, setLeads,
        companies,
        users,
        logs, fetchLogsByLead,
        loadingLeads, loadingLogs
    };
}