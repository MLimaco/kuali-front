import { LeadsController } from '../controller/leadsController.js';
import { useState, useEffect } from 'react';

export const LeadList = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadLeads = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await LeadsController.getAllLeads();
                setLeads(response.data);
            } catch (err) {
                setError(err.message || 'Error al cargar los leads');
            } finally {
                setLoading(false);
            }
        };
        loadLeads();
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {leads.length === 0 && <div>No hay leads para mostrar.</div>}
            {leads.map(lead => (
                <div key={lead.id}>
                    <h3>{lead.firstName} {lead.lastName}</h3>
                    <p>Email: {lead.email || 'N/A'}</p>
                    <p>Teléfono: {lead.phone || 'N/A'}</p>
                    <p>LinkedIn: {lead.linkedinProfile || 'N/A'}</p>
                    <p>Rol: {lead.rol || 'N/A'}</p>
                    <p>Seniority: {lead.senority || 'N/A'}</p>
                    <p>Área: {lead.area || 'N/A'}</p>
                    <p>Próximo paso: {lead.nextStep || 'N/A'}</p>
                    <p>Status: {lead.status || 'N/A'}</p>
                </div>
            ))}
        </div>
    );
};