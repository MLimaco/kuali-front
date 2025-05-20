import { useState, useEffect } from 'react';
import { leadsService } from '../services/leads.js';
import { logsService } from '../services/logsService.js';
import { companiesService } from '../services/companies.js';

export const LeadsPage = () => {
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState('');

    // --- NUEVO: Estados para historial de cambios de logs ---
    const [history, setHistory] = useState([]);
    const [showHistoryFor, setShowHistoryFor] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Al montar, trae leads, companies y todos los logs
    useEffect(() => {
        const fetchLeads = async () => {
            setLoadingLeads(true);
            const response = await leadsService.getAllLeads();
            setLeads(response);
            setLoadingLeads(false);
        };
        const fetchCompanies = async () => {
            const response = await companiesService.getAllCompanies();
            setCompanies(response);
        };
        const fetchAllLogs = async () => {
            setLoadingLogs(true);
            const response = await logsService.getAllLogs(); // Debes tener este método en logsService
            setLogs(response);
            setLoadingLogs(false);
        };
        fetchLeads();
        fetchCompanies();
        fetchAllLogs();
    }, []);

    // Al seleccionar un lead, trae solo sus logs
    const handleLeadClick = async (lead) => {
        if (selectedLead && selectedLead.id === lead.id) {
            setSelectedLead(null);
            setLoadingLogs(true);
            const response = await logsService.getAllLogs();
            setLogs(response);
            setLoadingLogs(false);
            return;
        }
        setSelectedLead(lead);
        setLoadingLogs(true);
        const response = await logsService.getLogsByLeadId(lead.id);
        setLogs(response);
        setLoadingLogs(false);
    };

    const filteredLeads = selectedCompanyId
        ? leads.filter(lead => String(lead.companyID) === selectedCompanyId)
        : leads;

    // --- NUEVO: Función para cargar historial de un log ---
    const handleShowHistory = async (contactLogID) => {
        // Si ya está abierto, colapsa
        if (showHistoryFor === contactLogID) {
            setShowHistoryFor(null);
            setHistory([]);
            return;
        }
        setShowHistoryFor(contactLogID);
        setLoadingHistory(true);
        try {
            const response = await fetch(`http://localhost:3000/api/logsHistory/${contactLogID}`);
            const data = await response.json();
            setHistory(data);
        } catch (err) {
            setHistory([{ error: 'Error al cargar el historial.' }]);
        } finally {
            setLoadingHistory(false);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Columna izquierda: Leads */}
            <div style={{ width: '40%', borderRight: '1px solid #ccc', padding: '1em', overflowY: 'auto' }}>
                {/* Filtro de empresas */}
                <div style={{ marginBottom: '1em' }}>
                    <label>Filtrar por empresa: </label>
                    <select
                        value={selectedCompanyId}
                        onChange={e => setSelectedCompanyId(e.target.value)}
                    >
                        <option value="">Todas</option>
                        {companies.map(company => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </div>
                <h2>Leads</h2>
                {loadingLeads ? <div>Cargando leads...</div> : (
                    filteredLeads.map(lead => (
                        <div
                            key={lead.id}
                            style={{
                                border: '1px solid #aaa',
                                borderRadius: '8px',
                                margin: '1em 0',
                                padding: '1em',
                                background: selectedLead?.id === lead.id ? '#e0f7fa' : '#fff',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleLeadClick(lead)}
                        >
                            <strong>{lead.firstName} {lead.lastName}</strong>
                            <div>{lead.rol || 'Sin rol'}</div>
                            <div>
                                <strong>
                                    {companies.find(c => c.id === lead.companyID)?.name || 'Sin empresa'}
                                </strong>
                            </div>
                            {selectedLead?.id === lead.id && (
                                <div style={{ marginTop: '1em', fontSize: '0.95em' }}>
                                    <div><strong>Teléfono:</strong> {lead.phone || 'N/A'}</div>
                                    <div><strong>Correo:</strong> {lead.mail || 'N/A'}</div>
                                    <div>
                                        <strong>LinkedIn:</strong> {lead.linkedinProfile
                                            ? <a href={lead.linkedinProfile} target="_blank" rel="noopener noreferrer">{lead.linkedinProfile}</a>
                                            : 'N/A'}
                                    </div>
                                    <div><strong>Seniority:</strong> {lead.senority || 'N/A'}</div>
                                    <div><strong>Área:</strong> {lead.area || 'N/A'}</div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Columna derecha: Logs */}
            <div style={{ width: '60%', padding: '1em', background: '#17607b22', overflowY: 'auto' }}>
                {!selectedLead && (
                    <div style={{ marginBottom: '1em', fontStyle: 'italic' }}>
                        Selecciona un lead para filtrar sus logs.
                    </div>
                )}
                {loadingLogs ? <div>Cargando logs...</div> : (
                    logs.length === 0
                        ? <div>No hay logs para mostrar.</div>
                        : logs.map(log => (
                            <div key={log.id} style={{ border: '1px solid #aaa', borderRadius: '8px', margin: '1em 0', padding: '1em', background: '#fff' }}>
                                <strong>Tipo:</strong> {log.type} <br />
                                <strong>Status:</strong> {log.status} <br />
                                <strong>Nota:</strong> {log.notes || 'N/A'} <br />
                                <strong>Fecha de creación:</strong> {log.createAt ? new Date(log.createAt).toLocaleString() : 'N/A'} <br />
                                <strong>Última actualización:</strong> {log.updatedAt ? new Date(log.updatedAt).toLocaleString() : 'N/A'} <br />
                                {/* --- NUEVO: Botón para ver historial --- */}
                                <button
                                    style={{ marginTop: '0.5em', marginBottom: '0.5em' }}
                                    onClick={() => handleShowHistory(log.id)}
                                >
                                    {showHistoryFor === log.id ? 'Ocultar historial' : 'Ver historial'}
                                </button>
                                {/* --- NUEVO: Desplegable de historial --- */}
                                {showHistoryFor === log.id && (
                                    <div style={{ marginTop: '0.5em', background: '#f5f5f5', padding: '0.5em', borderRadius: '6px' }}>
                                        {loadingHistory ? (
                                            <div>Cargando historial...</div>
                                        ) : (
                                            history.length === 0
                                                ? <div>No hay historial para este log.</div>
                                                : history[0]?.error
                                                    ? <div>{history[0].error}</div>
                                                    : history.map(item => (
                                                        <div key={item.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '0.5em', paddingBottom: '0.5em' }}>
                                                            <strong>Status:</strong> {item.status} <br />
                                                            <strong>Nota:</strong> {item.notes || 'N/A'} <br />
                                                            <strong>Usuario ID:</strong> {item.userID} <br />
                                                            <strong>Fecha de cambio:</strong> {item.changedAt ? new Date(item.changedAt).toLocaleString() : 'N/A'} <br />
                                                        </div>
                                                    ))
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                )}
            </div>
        </div>
    );
};