import { useState, useEffect } from 'react';
import { leadsService } from '../services/leads.js';
import { logsService } from '../services/logsService.js'; // Servicio para obtener logs por lead
import { companiesService } from '../services/companies.js'; // <-- NUEVO IMPORT


export const LeadsPage = () => {
    // Estado para la lista de leads
    const [leads, setLeads] = useState([]);
    // Estado para el lead seleccionado
    const [selectedLead, setSelectedLead] = useState(null);
    // Estado para los logs del lead seleccionado
    const [logs, setLogs] = useState([]);
    // Estado de carga para leads y logs
    const [loadingLeads, setLoadingLeads] = useState(true);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [companies, setCompanies] = useState([]); // <-- NUEVO
    const [selectedCompanyId, setSelectedCompanyId] = useState(''); // <-- NUEVO

    // Al montar el componente, trae la lista de leads
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
        fetchLeads();
        fetchCompanies(); // <-- NUEVO
    }, []);

    // Cuando el usuario hace clic en un lead, trae sus logs
    const handleLeadClick = async (lead) => {
        // Si ya está seleccionado, deselecciona y oculta detalles
        if (selectedLead && selectedLead.id === lead.id) {
            setSelectedLead(null);
            setLogs([]);
            return;
        }
        setSelectedLead(lead); // Marca el lead como seleccionado
        setLoadingLogs(true);
        const response = await logsService.getLogsByLeadId(lead.id); // Pide los logs de ese lead
        setLogs(response); // Guarda los logs en el estado
        setLoadingLogs(false);
    };

    const filteredLeads = selectedCompanyId
        ? leads.filter(lead => String(lead.companyID) === selectedCompanyId)
        : leads;


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
                {/* Muestra mensaje de carga o la lista de leads */}
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
                            {/* Compacto: nombre y rol */}
                            <strong>{lead.firstName} {lead.lastName}</strong>
                            <div>{lead.rol || 'Sin rol'}</div>
                            <div>
                                <strong>
                                    {companies.find(c => c.id === lead.companyID)?.name || 'Sin empresa'}
                                </strong>
                            </div>
                            {/* Si está seleccionado, muestra detalles */}
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
                {selectedLead ? (
                    <>
                        <h2>Logs de {selectedLead.firstName} {selectedLead.lastName}</h2>
                        {/* Muestra mensaje de carga o los logs */}
                        {loadingLogs ? <div>Cargando logs...</div> : (
                            logs.length === 0
                                ? <div>No hay logs para este lead.</div>
                                : logs.map(log => (
                                    <div key={log.id} style={{ border: '1px solid #aaa', borderRadius: '8px', margin: '1em 0', padding: '1em', background: '#fff' }}>
                                        <strong>Tipo:</strong> {log.type} <br />
                                        <strong>Status:</strong> {log.status} <br />
                                        <strong>Nota:</strong> {log.notes || 'N/A'} <br />
                                        <strong>Fecha programada:</strong> {log.scheduleDates ? new Date(log.scheduleDates).toLocaleString() : 'N/A'}
                                    </div>
                                ))
                        )}
                    </>
                ) : (
                    <div>Selecciona un lead para ver sus logs.</div>
                )}
            </div>
        </div>
    );
};